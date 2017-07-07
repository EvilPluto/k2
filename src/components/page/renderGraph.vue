<template>
    <div class="renderBox">
        <div class="top" style="margin-top:-50px; margin-bottom:30px;">
          <el-select v-model="imageType" placeholder="请选择流程表示模型">
             <el-option
             v-for="item in options"
             :key="item.value"
             :label="item.label"
             :value="item.value">
             </el-option>
          </el-select>
        </div>
        <div>
          <svg width="960" height="500" id="canvas"></svg>
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
            }
        },
        props:['payload','imageType','logId','methodId','paramList'],
        methods:{
            load(){
              switch(this.imageType){
                  case 1:
                    break;
                  case 2:
                    var para={"nodes":this.payload.nodes,"links":this.payload.links,"traces":this.payload.traces,"allTraces":this.payload.allTraces};
                    var draw=document.getElementById('canvas');
                    this.renderDiagraph(para,draw);
                    break;
                  case 3:
                    this.renderSankey(this.payload);
                    break;
                  case 4:
                    this.renderForce(this.payload);
                    break;
                  default:
                    break;
              }
              
            },
            renderSankey(json) {
                var self = this;           
                var svg = this.$d3.select("svg"),
                    width = +svg.attr("width"),
                    height = +svg.attr("height");
                var formatNumber = this.$d3.format(",.0f"),
                    format = function(d) { return formatNumber(d) + " TWh"; },
                    color = this.$d3.scaleOrdinal(this.$d3.schemeCategory10);

                var ss = sankey()
                    .nodeWidth(15)
                    .nodePadding(10)
                    .nodeId(function(d) { return d.name; })
                    .extent([[1, 1], [width - 1, height - 6]]);     
                var energy = json;
                console.log(energy);
                var graph = ss(energy);
                console.log(graph);
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
              var width = 800;
              var height = 600;
              var svg = this.$d3.select("svg")
                          .attr("width",width)
                          .attr("height",height);
              
              // 通过布局来转换数据，然后进行绘制
              var simulation = this.$d3.forceSimulation()
                    .force("link", this.$d3.forceLink().id(function(d) { return d.name; }))
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
                  .attr("stroke","#000")
                  .attr("stroke-width",1/* function(d) { return d.value / 5; }*/)
                  .attr("stroke-opacity", 0.5);
              // console.log('links', svg_links);

              var svg_nodes = svg.selectAll("circle")
                  .data(json.nodes)
                  .enter()
                  .append("circle")
                  .attr("r",2)
                  .attr("fill",function(d,i){
                      return color(i);
                  })    
                  .attr("cx",function(d){return d.x;})
                  .attr("cy",function(d){return d.y;})
                  .call(this.$d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended));
              
              var svg_text = svg.selectAll("text")
                  .data(json.nodes)
                  .enter()
                  .append("text")
                  .style("fill","#000")
                  .attr("dx",2)
                  .attr("dy",1)
                  .text(function(d){return d.name;});

              // console.log("转换后的nodes links数据:");
              // console.log(json.nodes);
              // console.log(json.links);
              
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
              // simulation.on("tick",draw);

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

        $(selector).parent().prepend("<p>单记录动画</p><div class='trace-input'>"+selectStr+"<button id='trace-submit'>运行</button><button id='trace-clean'>清除</button></div>");
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
        $(selector).parent().prepend("<p>全记录动画</p><div><button id='all-trace-run'>运行</button></div>");
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
          stroke-width: 2;
          stroke-opacity: 0.8;
    }
    circle:hover {
          r: 5;
    }
    text {
          font-family: sans-serif;
          font-weight: bold;
          font-size: 10px;
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
  max-width: 900px;
  overflow: hidden;
}

.trace-input button {
  display: inline-block;
  width: 60px;
}
</style>