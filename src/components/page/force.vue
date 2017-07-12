<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item><i class="el-icon-picture"></i> Test</el-breadcrumb-item>
                <el-breadcrumb-item>力导向图</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-button
                @click="load">
                点击就送
            </el-button>
        </div>
        <svg></svg>
    </div>
</template>

<script>
    import {event as currentEvent} from 'd3';
    export default {
        data() {
            return {
            }
        },
        methods:{
            load() {
              var json;
              $.ajax({
                  url: '/api/force',
                  type: 'GET',
                  async: false,
                  success: function(data) {
                      json = data.data;
                  },
                  error: function(error) {
                      console.log(error);
                  }
              }); 
                  
              var width = 800;
              var height = 600;
              var svg = this.$d3.select("svg")
                          .attr("width",width)
                          .attr("height",height);
              
              // 通过布局来转换数据，然后进行绘制
              var simulation = this.$d3.forceSimulation()
                    .force("link", this.$d3.forceLink().id(function(d) { return d.name; }).distance(100))
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
                  .attr("stroke-width",function (d) {
                    return Math.sqrt(d.value) > 10 ? 10 : Math.sqrt(d.value);
                  })
                  .attr("stroke-opacity", 0.5);

              var svg_nodes = svg.selectAll("circle")
                  .data(json.nodes)
                  .enter()
                  .append("circle")
                  .attr("r",6)
                  .attr("name", function(d) { return d.name; })
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
                  .style("fill","#EE6666")
                  .attr("class", "slice")
                  .attr("dx",2)
                  .attr("dy",1)
                  .text(function (d) {
                    if (d.name.length > 10)
                      return d.name.slice(0, 10) + '...';
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
            }
          }
        }
</script>

<style>
      line:hover {
          stroke-width: 10;
          stroke-opacity: 0.8;
      }
      circle:hover {
          r: 8;
      }
      text {
          font-family: sans-serif;
          font-weight: bold;
          font-size: 10px;
      }
</style>