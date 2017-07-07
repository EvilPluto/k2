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
                    .nodeId(function(d) { return d.name; })
                    .extent([[1, 1], [width - 1, height - 6]]);

                // 确认为数据问题，当数据不符合sankey图规范时，浏览器会陷入计算死循环，导致卡死
                // 暂时没有解决方案
                var json = {
                        "code": 200,
                        "payload": {
                            "mineUsetime": "5",
                            "netElementList": null,
                            "nodes": [
                                {
                                    "name": "a"
                                },
                                {
                                    "name": "b"
                                },
                                {
                                    "name": "c"
                                },
                                {
                                    "name": "d"
                                },
                                {
                                    "name": "e"
                                },
                                {
                                    "name": "f"
                                }
                            ],
                            "links": [
                                {
                                    "source": "a",
                                    "target": "d",
                                    "value": 1
                                },
                                {
                                    "source": "a",
                                    "target": "b",
                                    "value": 2
                                },
                                {
                                    "source": "a",
                                    "target": "e",
                                    "value": 1
                                },
                                {
                                    "source": "a",
                                    "target": "c",
                                    "value": 2
                                },
                                {
                                    "source": "b",
                                    "target": "f",
                                    "value": 1
                                },
                                {
                                    "source": "c",
                                    "target": "f",
                                    "value": 1
                                },
                                {
                                    "source": "d",
                                    "target": "f",
                                    "value": 3
                                },
                                {
                                    "source": "e",
                                    "target": "f",
                                    "value": 1
                                }
                            ],
                            "traces": null,
                            "allTraces": null
                        }
                    };
                
                var energy = json.payload;
                console.log(energy);
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
</style>