<template>
  <div class="boxx">
   <div class="head">
       <el-button @click="showMak">点击</el-button>
   </div>
   <svg id="canvas" width="1000" height="450"></svg>
   <div id="mask" class="mask"></div>
  </div>
</template>
<script>
export default{
    methods:{
    showMak(){
        var mask=document.getElementById('mask');

        var box=document.getElementsByClassName('boxx')[0];
       // var para=this.getViewport();
        console.log(mask);
        var computedStyle=document.defaultView.getComputedStyle(box,null);
        //console.log(document.documentElement.clientWidth);
        mask.style.width=computedStyle.width;
        mask.style.height=computedStyle.height;
        mask.style.display='block';
    },
    getViewport(){
       if(document.compatMode=='BackCompat'){               //IE7以下
           return {
               width:document.body.clientWidth,
               height:document.body.clientHeight
           }
       }else{
          // console.log(document.documentElement.clientHeight);
          // var computedStyle=document.defaultView.getComputedStyle(document.documentElement,null);
           return {
             width:document.documentElement.clientWidth,
             height:document.documentElement.clientHeight
           }
       }
    },
    trigger(){
     function renderDiagraph(data, selector) {
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
};
var response={"res":[{"element":"Activity0","name":"IncidentRegister","output":["IncidentAssign"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"true","isEnd":"false"},{"element":"Activity1","name":"TaskHangOn","output":["TaskAssign"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity2","name":"IncidentConfirm","output":["IncidentClose"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity3","name":"IncidentHandle","output":["IncidentHangOn","PlanDraft"],"subnetNum":1,"subnetList":[2],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity4","name":"IncidentHangOn","output":["IncidentHandle"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity5","name":"IncidentAssign","output":["IncidentHandle"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity6","name":"IncidentSolve","output":["IncidentConfirm"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity7","name":"PlanCancel","output":["PlanClose"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity8","name":"PlanClose","output":["IncidentSolve"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity9","name":"PlanDraft","output":["TaskCreate"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity10","name":"PlanFinish","output":["PlanClose"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity11","name":"PlanStart","output":["PlanCancel","TaskAssign"],"subnetNum":1,"subnetList":[2],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity12","name":"TaskAssign","output":["TaskExecute","TaskHangOn"],"subnetNum":1,"subnetList":[2],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity13","name":"TaskCancel","output":["TaskClose"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity14","name":"TaskClose","output":["PlanFinish"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity15","name":"TaskComplete","output":["TaskEvaluate"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity16","name":"TaskCreate","output":["PlanStart"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity17","name":"TaskDispatch","output":["TaskExecute"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity18","name":"TaskEvaluate","output":["TaskClose"],"subnetNum":1,"subnetList":[1],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity19","name":"TaskExecute","output":["PlanFinish","TaskCancel","TaskComplete","TaskDispatch"],"subnetNum":1,"subnetList":[4],"time":"304","isStart":"false","isEnd":"false"},{"element":"Activity20","name":"IncidentClose","output":[],"subnetNum":0,"subnetList":[],"time":"304","isStart":"false","isEnd":"true"}],"jsonStr":"{\"nodes\":[{\"name\":\"IncidentAssign\"},{\"name\":\"IncidentClose\"},{\"name\":\"IncidentConfirm\"},{\"name\":\"IncidentHandle\"},{\"name\":\"IncidentHangOn\"},{\"name\":\"IncidentRegister\"},{\"name\":\"IncidentSolve\"},{\"name\":\"PlanCancel\"},{\"name\":\"PlanClose\"},{\"name\":\"PlanDraft\"},{\"name\":\"PlanFinish\"},{\"name\":\"PlanStart\"},{\"name\":\"TaskAssign\"},{\"name\":\"TaskCancel\"},{\"name\":\"TaskClose\"},{\"name\":\"TaskComplete\"},{\"name\":\"TaskCreate\"},{\"name\":\"TaskDispatch\"},{\"name\":\"TaskEvaluate\"},{\"name\":\"TaskExecute\"},{\"name\":\"TaskHangOn\"}],\"links\":[{\"source\":\"IncidentAssign\",\"value\":\"100\",\"target\":\"IncidentHandle\"},{\"source\":\"IncidentConfirm\",\"value\":\"100\",\"target\":\"IncidentClose\"},{\"source\":\"IncidentHandle\",\"value\":\"13\",\"target\":\"IncidentHangOn\"},{\"source\":\"IncidentHandle\",\"value\":\"100\",\"target\":\"PlanDraft\"},{\"source\":\"IncidentRegister\",\"value\":\"100\",\"target\":\"IncidentAssign\"},{\"source\":\"IncidentSolve\",\"value\":\"100\",\"target\":\"IncidentConfirm\"},{\"source\":\"PlanCancel\",\"value\":\"13\",\"target\":\"PlanClose\"},{\"source\":\"PlanClose\",\"value\":\"100\",\"target\":\"IncidentSolve\"},{\"source\":\"PlanDraft\",\"value\":\"100\",\"target\":\"TaskCreate\"},{\"source\":\"PlanFinish\",\"value\":\"87\",\"target\":\"PlanClose\"},{\"source\":\"PlanStart\",\"value\":\"13\",\"target\":\"PlanCancel\"},{\"source\":\"PlanStart\",\"value\":\"87\",\"target\":\"TaskAssign\"},{\"source\":\"TaskAssign\",\"value\":\"87\",\"target\":\"TaskExecute\"},{\"source\":\"TaskAssign\",\"value\":\"14\",\"target\":\"TaskHangOn\"},{\"source\":\"TaskCancel\",\"value\":\"13\",\"target\":\"TaskClose\"},{\"source\":\"TaskClose\",\"value\":\"73\",\"target\":\"PlanFinish\"},{\"source\":\"TaskComplete\",\"value\":\"60\",\"target\":\"TaskEvaluate\"},{\"source\":\"TaskCreate\",\"value\":\"100\",\"target\":\"PlanStart\"},{\"source\":\"TaskDispatch\",\"value\":\"14\",\"target\":\"TaskExecute\"},{\"source\":\"TaskEvaluate\",\"value\":\"60\",\"target\":\"TaskClose\"},{\"source\":\"TaskExecute\",\"value\":\"14\",\"target\":\"PlanFinish\"},{\"source\":\"TaskExecute\",\"value\":\"13\",\"target\":\"TaskCancel\"},{\"source\":\"TaskExecute\",\"value\":\"60\",\"target\":\"TaskComplete\"}]}","traces":["IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose"],"Alltraces":["IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskCancel,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,IncidentHangOn,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,PlanCancel,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskHangOn,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskDispatch,TaskExecute,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose","IncidentRegister,IncidentAssign,IncidentHandle,PlanDraft,TaskCreate,PlanStart,TaskAssign,TaskExecute,TaskComplete,TaskEvaluate,TaskClose,PlanFinish,PlanClose,IncidentSolve,IncidentConfirm,IncidentClose"]};
var jsonData=response;
var jsonStr=JSON.parse(jsonData.jsonStr);
var para={"nodes":jsonStr.nodes,"links":jsonStr.links,"traces":jsonData.traces,"allTraces":jsonData.Alltraces};
var draw=document.getElementById('canvas');
renderDiagraph(para,canvas);
        }
    }
}
</script>
<style scoped>
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
.mask{
    position:absolute;
    top:0px;
    left:0px;
    filter:alpha(opacity=60);
    background-color:#ccc;
    z-index:1003;
    opacity:0.2;
    -moz-opacity:0.2;
}
</style>
