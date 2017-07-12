<template>
    <div class="renderBox">
        <div class="top" style="margin-top:-50px; margin-bottom:30px;">
          <el-select v-model="myImageType" placeholder="请选择流程表示模型" @change='reload'v-loading.fullscreen.lock="fullscreenLoading"element-loading-text="拼命加载中">
             <el-option
             v-for="item in options"
             :key="item.value"
             :label="item.label"
             :value="item.value">
             </el-option>
          </el-select>
        </div>
        <div id="depict" v-loading.fullscreen.lock="fullscreenLoading2"element-loading-text="拼命加载中"> 
             <svg width="960" height="500"></svg>
        </div>
    </div>
</template>

<script>
    import {event as currentEvent} from 'd3';
    import {sankey, sankeyLinkHorizontal} from 'd3-sankey';
    export default {
        data() {
            return {
                options: [{
                        value: 1,
                        label: '工作流网'
                    }, {
                        value: 2,
                        label: '流程图'
                    }, {
                        value: 3,
                        label: '桑基图'
                    }, {
                        value: 4,
                        label: '力导向图'
                    }],
                hostUrl:"/processmining",
                myPayLoad:'',
                myImageType:this.imageType,
                myLogId:'',
                myMethodId:'',
                myParamList:'',
                attrList:'',

                fullscreenLoading: false,
                fullscreenLoading2:false
            }
        },
        props:['payload','imageType','logId','methodId','paramList'],
        methods:{
            load(){
              this.myPayLoad=this.payload;
              this.myImageType=this.imageType;
              this.myLogId=this.logId;
              this.myMethodId=this.methodId;
              this.myParamList=this.paramList;
              this.painting();
            },
            clearDrop(){
                var drop=document.getElementsByClassName('drop')[0];
                var draw=document.getElementsByClassName('renderBox')[0];
                if(drop!=null){
                    draw.removeChild(drop);
                    console.log(draw);
                }
            },
            codeParsing(code) {
                var msg = (Title, Message) => {
                    this.$message({
                        title: Title,
                        message: Message,
                        type: 'error'
                    });
                };
                switch(code) {
                    case -1:
                        msg('系统错误', '未知错误，请上报管理员');
                        break;
                    case 201:
                        msg('输入域错误', '验证码错误');
                        break;
                    case 300:
                        msg('输入域错误', '邮箱或密码错误');
                        break;
                    case 301:
                        msg('权限问题', '用户已禁用，请联系管理员');
                        break;
                    case 302:
                        msg('权限问题', '用户未激活，请去邮箱激活用户');
                        break;
                    case 303:
                        msg('注册问题', '邮箱已占用，请更改邮箱');
                        break;
                    case 304:
                        msg('注册问题', '昵称已占用，请更改昵称');
                        break;
                    case 400:
                        msg('权限问题', '用户未登录或被下线，请重新登录：3s后跳转');
                        setTimeout(function() {
                            window.location.replace("../processmining/index.html");
                        break;
                    case 401:
                        msg('权限问题', '用户无权访问，请联系管理员');
                        break;
                    case 402:
                        msg('操作错误', '删除错误,请刷新重试');
                        break;
                    case 500:
                        msg('系统错误', '未知错误，请上报管理员');
                        break;
                    case 600:
                        msg('TIME_OUT', '访问超时，请检查网络连接');
                        break;
                    case 700:
                        msg('激活错误', '非法激活链接，请联系管理员');
                        break;
                    case 800:
                        msg('激活错误', '用户已被激活，请直接登录');
                        break;
                    case 900:
                        msg('事件化错误', '事件化失败');
                        break;
                    case 901:
                        msg('上传错误', '文件大小为0');
                        break;   
                    default:
                        break;
                }
            },
            painting(){
              switch(this.myImageType){
                  case 1:
                   var para=this.myPayLoad.netElementList;
                   this.clearDrop();
                   this.renderWorkflow(para);
                    break;
                  case 2:
                    var para={"nodes":this.myPayLoad.nodes,"links":this.myPayLoad.links,"traces":this.myPayLoad.traces,"allTraces":this.myPayLoad.allTraces};
                    var draw=document.getElementsByTagName('svg')[0];
                    this.clearDrop();
                    this.renderDiagraph(para,draw);
                    break;
                  case 3:
                    this.renderSankey(this.myPayLoad);
                    this.clearDrop();
                    break;
                  case 4:
                    this.attrList=this.myPayLoad.attrList;
                    if(this.attrList.length){
                        this.paintDownList();
                    }
                    this.renderForce(this.myPayLoad);
                    break;
                  default:
                    break;
              }   
            },
            paintDownList(){
                var option='';
                for(let i=0;i<this.attrList.length;i++){
                    //     this.choice[i]={};
                    //     this.choice[i].value=this.attrList[i];
                    //     this.choice[i].label=this.attrList[i];
                    option+='<option value ='+this.attrList[i]+'>'+this.attrList[i]+'</option>';
                }
                 //this.rrAttr=this.attrList[0];
                var draw=document.getElementsByClassName('renderBox')[0];
                var depict=document.getElementById('depict');
                var dick=document.createElement('div');
                dick.className='drop';
                dick.innerHTML="<span>event属性： </span><select class='downList'>"+option+"</select>";
                draw.insertBefore(dick,depict);    
                var drop=document.getElementsByClassName('downList')[0];
                var self=this;
                drop.onchange=function(event){
                    var dot=drop.value;
                    self.reloadForce(dot);
                }  
            },
            reload(){
                   this.fullscreenLoading = true;
                    var self=this;
                    self.$axios({
                            url:'/logMining/mining',
                            method:'post',
                            baseURL: self.hostUrl,
                            data:{
                                logId:self.myLogId,
                                methodId:self.myMethodId,
                                paramList:self.myParamList,
                                imageType:self.myImageType,
                                rrAttr:''
                            }
                    }).then((response)=>{
                        if(response.data.code==200){
                            this.myPayLoad=response.data.payload;
                            var myDiv=document.getElementById('depict');
                            myDiv.innerHTML='<svg width="960" height="500"></svg>';
                            this.painting();
                        }else{
                            self.codeParsing(response.data.code);
                        }
                        this.fullscreenLoading = false;
                    })
            },
            reloadForce(attr){
                var self=this;
                this.fullscreenLoading2=true;
                self.$axios({
                        url:'/logMining/mining',
                        method:'post',
                        baseURL: self.hostUrl,
                        data:{
                            logId:self.myLogId,
                            methodId:self.myMethodId,
                            paramList:self.myParamList,
                            imageType:self.myImageType,
                            rrAttr:attr
                        }
                }).then((response)=>{
                    if(response.data.code==200){
                        this.myPayLoad=response.data.payload;
                        var myDiv=document.getElementById('depict');
                        myDiv.innerHTML='<svg width="960" height="500"></svg>';
                        this.renderForce(this.myPayLoad);
                    }else{
                        self.codeParsing(response.data.code);
                    }
                    this.fullscreenLoading2=false;
                })
            },
            renderSankey(json){
                var self = this;
                var canvas=document.getElementsByTagName('svg')[0];
                 canvas.setAttribute('width',960) ;
                 canvas.setAttribute('height',500 * (1 + parseInt(json.nodes.length/10))) ;
                var svg = this.$d3.select("svg"),
                    width = +svg.attr("width"),
                    height = +svg.attr("height");
                var formatNumber = this.$d3.format(",.0f"),
                    format = function(d) { return formatNumber(d) + " TWh"; },
                    color = this.$d3.scaleOrdinal(this.$d3.schemeCategory10);

                var ss = sankey()
                    .nodeWidth(15)
                    .nodePadding(10)
                    .extent([[1, 1], [width - 1, height - 6]]);
                
                var energy = json;
                console.log(energy);
                pre(energy);
                var graph = ss(energy);

                var link = svg.append("g")
                    .attr("class", "links")
                    .attr("fill", "none")
                    .attr("stroke", "#000")
                    .attr("stroke-opacity", 0.2)
                    .selectAll("path")
                    .data(energy.links)
                    .enter().append("path")
                    .attr("d", sankeyLinkHorizontal())
                    .attr("stroke-width", function(d) { return Math.max(1, d.width); })
                    .call(this.$d3.drag()
                            .on("start", clickStarted)
                            .on("end", clickEnded));

                var node = svg.append("g")
                    .attr("class", "nodes")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .selectAll("g")
                    .data(energy.nodes)
                    .enter().append("g")
                    .call(this.$d3.drag()
                            .on("start", dragstarted)
                            .on("end", dragended));

                // 对数据进行加工，将不能用的数据剔除
                function pre(graph) {
                    var kimap = {};
                    var outEdgeCountMap = {};
                    var inEdgeCountMap = {};
                    var nGraph = {
                        nodes: [],
                        links: []
                    }
                    var ns = new Array();
                    var ls = new Array();
                    console.log('2333', nGraph);

                    for (var i = 0; i !== graph.nodes.length; i++) {
                        kimap[graph.nodes[i].name] = i;
                        outEdgeCountMap[graph.nodes[i].name] = 1;
                        inEdgeCountMap[graph.nodes[i].name] = 1;
                    }

                    var posMap = {};
                    for (var j = 0; j !== graph.links.length; j++) {
                        var s = graph.links[j].source;
                        var t = graph.links[j].target;
                        if (posMap[s] !== undefined) {
                            posMap[t] = posMap[s] + outEdgeCountMap[s];
                            outEdgeCountMap[s]++;
                        } else if (posMap[t] !== undefined) {
                            posMap[s] = posMap[t] - inEdgeCountMap[t];
                            inEdgeCountMap[t]++;
                        } else {
                            posMap[s] = 0;
                            posMap[t] = 1;
                            outEdgeCountMap[s]++;
                        }
                    }

                    ns = graph.nodes.sort(function (a, b) {
                        return posMap[a.name] - posMap[b.name];
                    });

                    for (var i = 0; i !== ns.length; i++) {
                        kimap[ns[i].name] = i;
                    }

                    for (var i = 0; i !== graph.links.length; i++) {
                        var s = kimap[graph.links[i].source];
                        var t = kimap[graph.links[i].target];
                        if (s > t) {
                            continue;
                        }
                        var tmp = {
                            source: s,
                            target: t,
                            value: parseInt(graph.links[i].value),
                        };
                        ls.push(tmp);
                    }

                    graph.nodes = ns;
                    graph.links = ls;
                }

                function clickStarted(d) {
                    var source = d.source.name;
                    var target = d.target.name;
                    var sourceDom, targetDom, thisDom;
                    
                    thisDom = this;
                    $(this).parent().children().each(function() {
                        if(this !== thisDom) {
                            $(this).addClass('clear');
                        }
                    });

                    $(this).parent().next().children().each(function() {
                        if ($(this).find('text').text() === source) {
                            return true;
                        }
                        if ($(this).find('text').text() === target) {
                            return true;                     
                        }
                        $(this).addClass('clear');
                    });
                }

                function clickEnded(d) {      
                    var source = d.source.name;
                    var target = d.target.name;
                    var sourceDom, targetDom, thisDom;
                    
                    thisDom = this;
                    $(this).parent().children().each(function() {
                        if(this !== thisDom) {
                            $(this).removeClass('clear');
                        }
                    });
                    $(this).parent().next().children().each(function() {
                        if ($(this).find('text').text() === source) {
                            return true;
                        }
                        if ($(this).find('text').text() === target) {
                            return true;                     
                        }
                        $(this).removeClass('clear');
                    });
                }

                function dragstarted(d) {
                    var sourceDomArr = new Array(), 
                        sourceNodesArr = new Array(), 
                        targetDomArr = new Array(), 
                        targetNodesArr = new Array(),
                        thisDom;
                    var sourceArr = d.sourceLinks;
                    for (var i=0; i<sourceArr.length; i++) {
                        var name = sourceArr[i].source.name 
                            + " → " + sourceArr[i].target.name 
                            + "\n" + format(sourceArr[i].value);
                        sourceDomArr.push(name);
                        sourceNodesArr.push(sourceArr[i].target.name);
                    }
                    var targetArr = d.targetLinks;
                    for (var i=0; i<targetArr.length; i++) {
                        var name = targetArr[i].source.name 
                            + " → " + targetArr[i].target.name 
                            + "\n" + format(targetArr[i].value);
                        targetDomArr.push(name);
                        targetNodesArr.push(targetArr[i].source.name);
                    }
                    console.log(sourceDomArr, targetDomArr, sourceNodesArr, targetNodesArr);
                    
                    thisDom = this;
                    $(this).parent().children().each(function() {
                        if(this === thisDom) {
                            return true;
                        }
                        if (sourceNodesArr.indexOf($(this).find('text').text()) !== -1) {
                            return true;
                        }
                        if (targetNodesArr.indexOf($(this).find('text').text()) !== -1) {
                            return true;
                        }
                        $(this).addClass('clear');
                    });

                    $(this).parent().prev().children().each(function() {
                        console.log($(this).find('title').text());
                        if (sourceDomArr.indexOf($(this).find('title').text()) !== -1) {
                            $(this).addClass('select');
                            return true;
                        }
                        if (targetDomArr.indexOf($(this).find('title').text()) !== -1) {
                            $(this).addClass('select');
                            return true;                     
                        }
                        $(this).addClass('clear');
                    });
                }

                function dragended(d) {
                     var sourceDomArr = new Array(), 
                        sourceNodesArr = new Array(), 
                        targetDomArr = new Array(), 
                        targetNodesArr = new Array(),
                        thisDom;
                    var sourceArr = d.sourceLinks;
                    for (var i=0; i<sourceArr.length; i++) {
                        var name = sourceArr[i].source.name 
                            + " → " + sourceArr[i].target.name 
                            + "\n" + format(sourceArr[i].value);
                        sourceDomArr.push(name);
                        sourceNodesArr.push(sourceArr[i].target.name);
                    }
                    var targetArr = d.targetLinks;
                    for (var i=0; i<targetArr.length; i++) {
                        var name = targetArr[i].source.name 
                            + " → " + targetArr[i].target.name 
                            + "\n" + format(targetArr[i].value);
                        targetDomArr.push(name);
                        targetNodesArr.push(targetArr[i].source.name);
                    }
                    console.log(sourceDomArr, targetDomArr, sourceNodesArr, targetNodesArr);
                    
                    thisDom = this;
                    $(this).parent().children().each(function() {
                        if(this === thisDom) {
                            return true;
                        }
                        if (sourceNodesArr.indexOf($(this).find('text').text()) !== -1) {
                            return true;
                        }
                        if (targetNodesArr.indexOf($(this).find('text').text()) !== -1) {
                            return true;
                        }
                        $(this).removeClass('clear');
                    });

                    $(this).parent().prev().children().each(function() {
                        console.log($(this).find('title').text());
                        if (sourceDomArr.indexOf($(this).find('title').text()) !== -1) {
                            $(this).removeClass('select');
                            return true;
                        }
                        if (targetDomArr.indexOf($(this).find('title').text()) !== -1) {
                            $(this).removeClass('select');
                            return true;                     
                        }
                        $(this).removeClass('clear');
                    });
                }

                link.append("title")
                  .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

                node.append("rect")
                  .attr("x", function(d) { return d.x0; })
                  .attr("y", function(d) { return d.y0; })
                  .attr("height", function(d) { return d.y1 - d.y0; })
                  .attr("width", function(d) { return d.x1 - d.x0; })
                  .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
                  .attr("stroke", "#000");

                node.append("text")
                  .attr("x", function(d) { return d.x0 - 6; })
                  .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
                  .attr("dy", "0.35em")
                  .attr("text-anchor", "end")
                  .text(function(d) { return d.name; })
                  .filter(function(d) { return d.x0 < width / 2; })
                  .attr("x", function(d) { return d.x1 + 6; })
                  .attr("text-anchor", "start");

                node.append("title")
                  .text(function(d) { return d.name + "\n" + format(d.value); });

            },
            renderForce(json){
              var width = 960;
              var height = 500;
              var svg = this.$d3.select("svg")
                          .attr("width",width)
                          .attr("height",height);
              
              // 通过布局来转换数据，然后进行绘制
              var simulation = this.$d3.forceSimulation()
                    .force("link", this.$d3.forceLink().id(function(d) { return d.name; })
                                                          .distance(function(d){ 
                                                           console.log(d.value)
                                                           if(d.value<50){return d.value+50;}
                                                           if(d.value>180){return 180;}
                                                           else{return d.value;}}))
                    .force("charge",this.$d3.forceManyBody())
                    .force("center",this.$d3.forceCenter(width/2, height/2));
              // console.log(simulation);

              simulation.nodes(json.nodes).on('tick', draw);
              simulation.force('link').links(json.links);

              var color = this.$d3.scaleOrdinal(this.$d3.schemeCategory20);  
              // 绘制
              var svg_links = svg.selectAll("line")
                  .data(json.links)
                  .enter()
                  .append("line")
                  .attr("class", "lines")
                  .attr("stroke","#91918d")   //填充木棍颜色
                  .attr("stroke-width",function (d) {
                    return Math.sqrt(d.value) > 5 ? 5 : Math.sqrt(d.value);   //木棍宽度
                  })
                  .attr("stroke-opacity", 0.5);     //木棍透明度

              var svg_nodes = svg.selectAll("circle")
                  .data(json.nodes)
                  .enter()
                  .append("circle")
                  .attr("r",8)                        //木棍头半径
                  .attr("name", function(d) { return d.name; })
                  .attr("fill",function(d,i){
                      return color(i);               //木棍头颜色
                  })    
                  .attr("cx",function(d){return d.x;})
                  .attr("cy",function(d){return d.y;})
                  .call(this.$d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended));
               svg_nodes.append('title')
                       .text(function(d){
                            return d.name;
                       });
              var svg_text = svg.selectAll("text")
                  .data(json.nodes)
                  .enter()
                  .append("text")
                  .style("fill","#666")
                  .attr("class", "slice")
                  .attr("dx",2)
                  .attr("dy",1)
                  .text(function (d) {
                    if (d.name.length > 8)
                      return d.name.slice(0, 8) + '...';
                    else
                      return d.name;
                  });
              
              function draw(){
                  svg_nodes
                      .attr("cx",function(d){return d.x;})
                      .attr("cy",function(d){return d.y;});

                  svg_text
                      .attr("x", function(d){ return d.x; })
                       .attr("y", function(d){ return d.y; });

                  svg_links
                      .attr("x1",function(d){return d.source.x; })
                       .attr("y1",function(d){ return d.source.y; })
                       .attr("x2",function(d){ return d.target.x; })
                       .attr("y2",function(d){ return d.target.y; });
              }

              function dragstarted(d) {
                console.log("DragStarted");
                if (!currentEvent.active) {
                  simulation.alphaTarget(0.3).restart();
                }
                d.fx = d.x;
                d.fy = d.y;
              }

              function dragged(d) {
                console.log("Dragged");
                d.fx = currentEvent.x;
                d.fy = currentEvent.y;
              }

              function dragended(d) {
                console.log("DragEnded");
                if (!currentEvent.active) {
                  simulation.alphaTarget(0);
                }
                d.fx = null;
                d.fy = null;
              }
            },
            //流程图
            renderDiagraph(data, selector) {
                var params = {
                'radius': 10,
                'margin': 30
                };
                var nodeValueMap = {};
                var nodeSizeMap = {};
                var edgeValueMap = {};
                var edgeWidthMap = {};
                var linkMap = {};
                data.nodes.forEach(function(node) {
                    nodeValueMap[node.name] = 0;
                nodeSizeMap[node.name] = params.radius;
                });
                data.links.forEach(function(link) {
                    nodeValueMap[link.source] += parseInt(link.value);
                nodeValueMap[link.target] += parseInt(link.value);
                edgeValueMap[link.source+":"+link.target] = parseInt(link.value);
                });
                function getMinMax(someMap) {
                    var range = [-1, -1];
                    for (var key in someMap) {
                        if (range[1] === -1 || range[1] < someMap[key]) {
                            range[1] = someMap[key];
                        }
                        if (range[0] === -1 || range[0] > someMap[key]) {
                            range[0] = someMap[key];
                        }
                    }
                    return range;
                }
                function getRatio(v ,range) {
                    if (range[1] - range[0] <= 0) {
                        return 0;
                    } else {
                        return (v - range[0])/(range[1] - range[0]);
                    }
                }
                var nodeRange = getMinMax(nodeValueMap);
                var edgeRange = getMinMax(edgeValueMap);

                for (var key in nodeValueMap) {
                    nodeSizeMap[key] += parseInt(20 * getRatio(nodeValueMap[key], nodeRange));
                }
                for (var key in edgeValueMap) {
                    edgeWidthMap[key] = 1 + parseInt(10*getRatio(edgeValueMap[key], edgeRange));
                }

    
                function produceLayout(input, conf) {
                var g = new dagre.graphlib.Graph();
                g.setGraph(conf);
                g.setDefaultEdgeLabel(function() { return {}; });
                input.nodes.forEach(function(node) {
                    g.setNode(node.name, { label: node.name,  width: nodeSizeMap[node.name]*2, height: nodeSizeMap[node.name]*2 });
                });
                input.links.forEach(function(link) {
                    g.setEdge(link.source, link.target);
                });
                dagre.layout(g);
                return g;
                }
                var line = d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .interpolate("basis");

                var layout = produceLayout(data, { rankdir: "LR", nodesep: 80, ranksep: 150, edgesep: 10, marginx: params.radius*2 + params.margin, marginy: params.radius*2 + params.margin });
    
                var timers1, timers2;
                function runTrace(trace) {
                    var traceTimers = [];
                    var du = 1000;
                    var traceMap = {};

                    for (var i = 0; i !== trace.length; i++) {
                        var node = layout.node(trace[i]);
                        if (node === undefined) {
                            console.log("没有找到节点");
                            return traceTimers;
                        }
                        if (i + 1 >= trace.length) {
                            (function() {
                            var tNode = node;

                            var t = setTimeout(function() {
                                traceGroup.append("circle")
                                        .attr('cx', tNode.x)
                                        .attr('cy', tNode.y)
                                        .attr('r', 5);
                                }, du*i);
                                traceTimers.push(t);
                            })();
                        } else {
                            var edge = layout.edge({v: trace[i], w: trace[i+1]});
                            var str = trace[i]+'->'+trace[i+1];
                            if (edge === undefined) {
                                console.log("没有找到边");
                                continue;
                            }

                            (function() {
                                var tEdge = edge;
                                var tNode = node;
                                var tIndex = i;
                                var tStr = str;
                                var t = setTimeout(function() {
                                    traceGroup.append("circle")
                                            .attr('cx', tNode.x)
                                            .attr('cy', tNode.y)
                                            .attr('r', 5);

                                    var p = traceGroup.append("path")
                                        .attr("class","edge")
                                        .attr("id", "trace-"+tIndex)
                                        .attr("d", line(tEdge.points)) 
                                        .attr("stroke-width", function(d) {
                                            return 2;
                                        })
                                        .style("stroke", function(d) {
                                            if (traceMap[tStr] === undefined) {
                                                traceMap[tStr] = 1;
                                            } else {
                                                traceMap[tStr] += 1;
                                            }
                                            return traceMap[tStr]%2===1?'red':'blue';
                                        });
                                    var l = $('#trace-'+tIndex)[0].getTotalLength();
                                    p.style("stroke-dasharray", l);
                                    p.style("stroke-dashoffset", l);
                                    p.transition()
                                        .style("stroke-dashoffset", 0)
                                        .duration(du);
                                    }, du*i);
                                    traceTimers.push(t);
                            })();
                        }
                    }
                    return traceTimers;
                }
                function cleanTrace() {
                    if (timers1 !== undefined) {
                        timers1.forEach(function(timer) {
                            clearTimeout(timer);
                        })
                    }
                    $(".trace-group").html('');
                    if (timers2 !== undefined) {
                        timers2.forEach(function(timer) {
                            clearTimeout(timer);
                        })
                        links.attr("stroke-width", function(d) {
                            return edgeWidthMap[d.v+':'+d.w];
                        });
                    }
                }
                function traceAniInit() {
                    var selectStr = '<select id="trace-input">';
                    for (var i = 0;i !== data.traces.length; i++) {
                        selectStr += '<option value="'+data.traces[i]+'">'+data.traces[i]+'</option>';
                    }
                    selectStr += '</select>';

                    $(selector).parent().prepend("<div class='trace-input'><button id='trace-submit' class='traceButton'>运行单记录动画</button><button id='trace-clean' class='traceButton'>清除</button><div>"+selectStr+"</div></div>");
                    $('#trace-submit').click(function() {
                        cleanTrace();

                        var trace = $("#trace-input").val().split(",");
                        timers1 = runTrace(trace);
                    });
                    $('#trace-clean').click(function() {
                        cleanTrace();
                    })
                }

                function allTraceAniInit() {
                    var traceTimers = []; 
                    $(selector).parent().prepend("<button id='all-trace-run' class='traceButton'>运行全记录动画</button>");
                    $("#all-trace-run").click(function() {
                        cleanTrace();
                        links.attr("stroke-width", 0);
                        var timerArr = [];
                        for (var i = 0 ; i !== data.allTraces.length; i++) {
                            var trace = data.allTraces[i].split(",");
                            for (var j = 0; j !== trace.length; j++) {
                                if (j+1 < trace.length) {
                                    var tStr = trace[j]+':'+trace[j+1];
                                    if (!linkMap[tStr]) {
                                        continue;
                                    }
                                    var v = 1/edgeValueMap[tStr] * edgeWidthMap[tStr];

                                    function creator(str, v) {
                                        return function() {
                                            linkMap[str].attr("stroke-width", function() {
                                                return parseFloat(d3.select(this).attr("stroke-width")) + v;
                                            });
                                            linkMap[str].style("stroke", "red").transition().duration(500).style("stroke", "#ccc");
                                        }
                                    }

                                    timerArr.push(creator(tStr, v));
                                }
                            }
                        }

                        for (var k=0;k!==timerArr.length;k++) {
                            traceTimers.push(setTimeout(timerArr[k], 100*k));
                        }
                        traceTimers.push(setTimeout(function() {
                            links.attr("stroke-width", function(d) {
                                return edgeWidthMap[d.v+':'+d.w];
                            });
                        }, 100*timerArr.length));
                        timers2 = traceTimers;
                    });
                }

                if (data.traces !== undefined) {
                    traceAniInit();
                }

                if (data.allTraces !== undefined) {
                    allTraceAniInit();
                }

                var svg = d3.select(selector).attr('class', 'diagraph');

                var marker=svg.append("marker")
                    .attr("id","arrow")  
                    .attr("markerUnits","userSpaceOnUse")  
                    .attr("markerWidth","12")  
                    .attr("markerHeight","16")  
                    .attr("viewBox","0 0 12 18")   
                    .attr("refX","6")  
                    .attr("refY","10")  
                    .attr("orient","auto") 
                    .append("path")
                    .attr("d", "M2,2 L2,18 L10,10 L2,2")//箭头的路径
                    .attr('fill','black')//箭头颜色


                var wrapper = svg.append("g");
                var g = wrapper.append("g");
                var traceGroup = wrapper.append("g").attr("class", "trace-group");

                svg.call(d3.behavior.zoom()
                    .scaleExtent([1 / 8, 8])
                    .on("zoom", zoomed));

                function zoomed() {
                wrapper.attr("transform",   
                    "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");  
                }

                var edges = g.selectAll(".edge")
                .data(layout.edges())
                .enter()
                .append('g')
                .attr("class", "edge");

                var links = edges.append("path")
                .attr("d", function(d) {
                    linkMap[d.v+':'+d.w] = d3.select(this);
                    return line(layout.edge(d).points);
                })
                .attr("stroke-width", function(d) {
                    return edgeWidthMap[d.v+':'+d.w];
                })
                .attr("marker-end", "url(#arrow)");

                links.append("title")
                .text(function(d) {
                    return edgeValueMap[d.v+':'+d.w];
                });

                var nodes = g.selectAll(".node")
                .data(layout.nodes())
                .enter()
                .append('g')
                .attr("class", "node");

                nodes.append("title")
                .text(function(d) {
                    return d;
                });

                nodes.append('circle')
                .attr('cx', function(d) { return layout.node(d).x; })
                .attr('cy', function(d) { return layout.node(d).y; })
                .attr('r', function(d) {
                    return nodeSizeMap[d];
                });

                nodes.append('text')
                .attr('x', function(d) { return layout.node(d).x - 30; })
                .attr('y', function(d) { return layout.node(d).y - nodeSizeMap[d] - 5; })
                .text(function(d) {
                    if(d.length > 10) 
                    return d.slice(0,10) + '...';
                    else 
                    return d;
                })
            },
            //工作流网
            renderWorkflow(datas){
                // Create a new directed graph
                var g = new dagreD3.graphlib.Graph().setGraph({
                    rankdir: "LR"
                });
                for (var index in datas) {
                    var data = datas[index];
                    var name = data.name;
                    // 先设置节点
                    data.label = name;
                    data.rx = data.ry = 5;
                    g.setNode(name, data);
                    // 此处将output转化为二维数组
                    var subnetNum = data.subnetNum;
                    var subnetList = data.subnetList;
                    var output = translate(data.output, subnetNum, subnetList);
                    var isStart = data.isStart;
                    var isEnd = data.isEnd;
                    var kusuo;
                    // 开始画库所和边
                    if (isStart == "true") {
                        // 设置开所
                        g.setNode("start", {
                            label: "start",
                            shape: "circle"
                        });
                        g.setEdge("start", data.name, {
                            label: "",
                            lineInterpolate: 'basis',
                            width: 30
                        });
                    }
                    if (isEnd == "true") {
                        // 设置结束库所
                        g.setNode("end", {
                            label: "end",
                            shape: "circle"
                        });
                        g.setEdge(name, "end", {
                            label: "",
                            lineInterpolate: 'basis',
                            width: 30
                        });
                    } else {
                        // 如果输出不为空，则先画source到库所的边
                        for (var i in output) {
                            kusuo = output[i].join("").toUpperCase();
                            g.setNode(kusuo, {
                                label: "",
                                shape: "circle"
                            });
                            g.setEdge(name, kusuo, {
                                label: "",
                                lineInterpolate: 'basis',
                                width: 30
                            });
                            // 库所到output的边
                            for (var j in output[i]) {
                                g.setEdge(kusuo, output[i][j], {
                                    label: "",
                                    lineInterpolate: "basis",
                                    width: 30
                                });
                            }
                        }
                    }
                }
                // 一维数组转化为二维数组
                function translate(arr, col, row) {
                    var arr1 = [];
                    for (var i = 0; i < col; i++) {
                        var arr2 = [];
                        for (var j = 0; j < row[i]; j++) {
                            if (arr != null)
                                arr2[j] = arr.shift();
                        }
                        arr1.push(arr2);
                    }
                    return arr1;
                }
                // Create the renderer
                var render = new dagreD3.render();

                // Set up an SVG group so that we can translate the final graph.
                var svg = d3.select("svg"),
                    inner = svg.append("g").attr('class','svg-body')

                // Set up zoom support
                var zoom = d3.behavior.zoom().on("zoom", function () {
                    inner.attr("transform", "translate(" + d3.event.translate + ")" +
                        "scale(" + d3.event.scale + ")");


                });
                svg.call(zoom).on("dblclick.zoom", null);

                inner.on("dblclick", function (d) {
                    document.getElementById("attr").innerHTML = "双击事件";
                });
                // Run the renderer. This is what draws the final graph.
                render(inner, g);
                // Center the graph
                var initialScale = 0.8;
                zoom
                    .translate([(svg.attr("width") - g.graph().width * initialScale) *0,10])
                    .scale(initialScale)
                    .event(svg);
                // svg.attr('height', g.graph().height * initialScale + 40);     
                d3.selectAll('rect')
                    .attr({
                    'cursor': 'move',
                    'stroke': '#a8c16d',
                    'fill': '#efffd2',
                    'color':'#fff'
                });
                d3.selectAll('text')
                .attr({
                    'pointer-events': 'none',
                    'fill':'#5F772D',
                });
                d3.selectAll('circle')
                .attr({
                    'fill': '#E4E4E4',
                    'stroke':'#bebebe'
                })
                d3.selectAll('.edgePath path')
                .attr({
                    'width':'10px',
                    'stroke': '#9BCB37',
                    'fill': '#9BCB37',
                    'stroke-width': '1.5px'
                })          
            }
                    },
                    mounted(){
                    var vm=this;
                    vm.load();
                },
            }
</script>

<style>
    .renderBox p{
       font-size: 13px;
       font-family: "Helvetica Neue",Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
    }
    .top{
        width:300px;
        position: relative;
        top:-20px;
    }
    .renderBox{
        margin-top: 20px;
    }
    #depict{
        width: 970px;
        height: 510px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    path:hover {
        stroke-opacity: 0.5;
        /*stroke: red;*/
    }
    .select {
        stroke-opacity: 0.5;
    }
    .clear {
        /*stroke: black;*/
        stroke-opacity: 0.1;
        /*stroke-opacity: 1;*/
    }
    .clear rect {
        opacity: 0.1;
        /*fill: white;*/
    }
    .clear text {
        opacity: 0.1;
    }

    /*力导向图*/
    line:hover {
          stroke-width: 6;
          stroke-opacity: 0.8;
          stroke: #ff9900;
    }
    circle:hover {
          r: 10;
    }
    text {
          font-family: "Comic Sans MS", serif;
          font-weight: normal;
          font-size: 14px;
    }
    .downList{
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        display: block;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: 0;
        padding: 3px 10px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        position: relative;
        left: 91px;
        top:-28px;
    }
    .downList option{
        padding:10px;
        min-height:36px;
        line-height: 1;
        font-size:14px;
        margin:5px auto;
    }
    /*流程图*/
    .diagraph circle {
         fill: steelblue;
   }
    .diagraph .edge {
         stroke: #ccc;
         fill: none;
   }
   .diagraph text {
         fill: #333;
   } 
  .trace-group circle {
         fill: red;
  }
   .trace-group .edge {
         fill: none;
         stroke: red;
   }

    .trace-input select {
        display: inline-block;
        font-size: 16px;
        height: 40px;
        width: 960px;
        overflow: hidden;
        border:#bfcbd9 solid 1px;
        margin: 0 auto;
        position: relative;
        top: -20px;
    }
    #trace-input{
        max-width: 960px;
    }
    .traceButton{
        display:inline-block;
        border:#20a0ff solid 1px;
        border-radius: 4px;
        white-space: nowrap;
        padding: 10px 15px;
        cursor: pointer;
        line-height: 1;
        color: #fff;
        background-color: #20a0ff;
        position: relative;
    }
    .traceButton:hover,.traceButton:focus{
        background: #4db3ff;
        border-color: #4db3ff;
        color: #fff;
    }
    #trace-submit{
        top: -30px;
        left: 145px;
    }
    #all-trace-run{
        top: 5px;
    }
    #trace-clean{
        top: -30px;
        left: 776px;
    }
</style>