<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item><i class="el-icon-picture"></i> Test</el-breadcrumb-item>
                <el-breadcrumb-item>桑基图</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-button
                @click="load">
                点击就送
            </el-button>
        </div>
        <svg width="960" height="500"></svg>
    </div>
</template>

<script>
    import {sankey, sankeyLinkHorizontal} from 'd3-sankey';
    export default {
        data() {
            return {
            }
        },
        methods:{
            load() {
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
                    .extent([[1, 1], [width - 1, height - 6]]);

                  var json;
                  $.ajax({
                      url: '/api/sankey',
                      type: 'GET',
                      async: false,
                      success: function(data) {
                          json = data.data;
                      },
                      error: function(error) {
                          console.log(error);
                      }
                  }); 
                
                var energy = json.payload;
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

            }
        }
    }
</script>

<style>
    path:hover {
        stroke-opacity: 0.5;
    }
    .select {
        stroke-opacity: 0.5;
    }
    .clear {
        stroke-opacity: 0.1;
    }
    .clear rect {
        opacity: 0.1;
    }
    .clear text {
        opacity: 0.1;
    }
</style>