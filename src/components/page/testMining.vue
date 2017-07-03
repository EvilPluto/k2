<template>
    <div>
        <el-button
            type="primary"
            size="large"
            @click="load1"
            >
            力导向图
        </el-button>
        <el-button
            type="primary"
            size="large"
            @click="load2"
            >
            桑基图
        </el-button>
        <br/>
        <br/>
        <el-carousel indicator-position="outside">
            <el-carousel-item>
                <svg id="force"></svg>
            </el-carousel-item>
            <el-carousel-item>
                <svg id="sankey"></svg>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    import {sankey, sankeyLinkHorizontal} from 'd3-sankey';
    import {event as currentEvent} from 'd3';
    export default {
        data() {
            return {
            }
        },
        methods:{
            load2() {
                var self = this;

                var width = 800;
                var height = 400;
                
                var svg = this.$d3.select("#sankey")
                            .attr('width', width)
                            .attr('height', height);
                var formatNumber = this.$d3.format(",.0f"),
                    format = function(d) { return formatNumber(d) + " TWh"; },
                    color = this.$d3.scaleOrdinal(this.$d3.schemeCategory10);

                var ss = sankey()
                    .nodeWidth(15)
                    .nodePadding(10)
                    // .nodeId(function(d) { return d.name; })
                    .extent([[1, 1], [width - 1, height - 6]]);

                // 确认为数据问题，当数据不符合sankey图规范时，浏览器会陷入计算死循环，导致卡死
                // 暂时没有解决方案
                var json;
                $.ajax({
                    url: '/api/sankey',
                    type: 'GET',
                    async: false,
                    success: function(data) {
                        json = data.data;
                        console.log(data.data);
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });
                
                var energy = json;
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

            },
            load1() {
              var json;
              $.ajax({
                  url: '/api/force',
                  type: 'GET',
                  async: false,
                  success: function(data) {
                      json = data.data;
                      // console.log(data.data);
                  },
                  error: function(error) {
                      console.log(error);
                  }
              }); 
                  
            var width = 800;
            var height = 400;
              var svg = this.$d3.select("#force")
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
                  .attr("stroke-width",1/*, function(d) { return d.value / 5; }*/)
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
            }
          }
        }
</script>

<style>
    #force,
    #sankey {
        padding: 50px;
    }
    .el-carousel {
        width: 900px;
        height: 500px;
    }
    .el-carousel__container {
        height: 500px;
    }
    .el-carousel__item {
        background: rgba(204, 204, 204, 0.5);
    }
</style>