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
                var data={
    "code": 200,
    "payload": {
        "mineUsetime": "62",
        "netElementList": null,
        "nodes": [
            {
                "name": "accept"
            },
            {
                "name": "collect reviews"
            },
            {
                "name": "decide"
            },
            {
                "name": "get review 1"
            },
            {
                "name": "get review 2"
            },
            {
                "name": "get review 3"
            },
            {
                "name": "get review X"
            },
            {
                "name": "invite additional reviewer"
            },
            {
                "name": "invite reviewers"
            },
            {
                "name": "reject"
            },
            {
                "name": "time-out 1"
            },
            {
                "name": "time-out 2"
            },
            {
                "name": "time-out 3"
            },
            {
                "name": "time-out X"
            }
        ],
        "links": [
            {
                "source": "collect reviews",
                "target": "decide",
                "value": 100
            },
            {
                "source": "decide",
                "target": "accept",
                "value": 45
            },
            {
                "source": "decide",
                "target": "invite additional reviewer",
                "value": 526
            },
            {
                "source": "decide",
                "target": "reject",
                "value": 55
            },
            {
                "source": "get review 1",
                "target": "collect reviews",
                "value": 11
            },
            {
                "source": "get review 2",
                "target": "collect reviews",
                "value": 10
            },
            {
                "source": "get review 3",
                "target": "collect reviews",
                "value": 11
            },
            {
                "source": "get review X",
                "target": "decide",
                "value": 263
            },
            {
                "source": "invite additional reviewer",
                "target": "get review X",
                "value": 263
            },
            {
                "source": "invite additional reviewer",
                "target": "time-out X",
                "value": 263
            },
            {
                "source": "invite reviewers",
                "target": "get review 1",
                "value": 16
            },
            {
                "source": "invite reviewers",
                "target": "time-out 1",
                "value": 16
            },
            {
                "source": "invite reviewers",
                "target": "get review 2",
                "value": 19
            },
            {
                "source": "invite reviewers",
                "target": "time-out 2",
                "value": 12
            },
            {
                "source": "invite reviewers",
                "target": "get review 3",
                "value": 19
            },
            {
                "source": "invite reviewers",
                "target": "time-out 3",
                "value": 18
            },
            {
                "source": "time-out 1",
                "target": "collect reviews",
                "value": 22
            },
            {
                "source": "time-out 2",
                "target": "collect reviews",
                "value": 26
            },
            {
                "source": "time-out 3",
                "target": "collect reviews",
                "value": 20
            },
            {
                "source": "time-out X",
                "target": "decide",
                "value": 263
            }
        ],
        "traces": null,
        "allTraces": null
    }
};
              var json=data.payload;
              
                  
              var width = 800;
              var height = 600;
              var svg = this.$d3.select("svg")
                          .attr("width",width)
                          .attr("height",height);
              
              // 通过布局来转换数据，然后进行绘制
              var simulation = this.$d3.forceSimulation()
                    .force("link", this.$d3.forceLink().id(function(d) { return d.name; })
                                                       .distance(function(d){ 
                                                           console.log(d.value)
                                                           if(d.value<50){return d.value+50;}
                                                           if(d.value>200)return d.value-100;
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
                  .attr("stroke","#515151")
                  .attr("stroke-width",function (d) {
                    return Math.sqrt(d.value) > 5 ? 5 : Math.sqrt(d.value);
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
              svg_nodes.append('title')
                       .text(function(d){
                            return d.name;
                       });
              var svg_text = svg.selectAll("text")
                  .data(json.nodes)
                  .enter()
                  .append("text")
                  .style("fill","#EE6666")
                  .attr("class", "slice")
                  .attr("dx",2)
                  .attr("dy",1)
                  .text(function (d) {
                    return '';
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
          stroke-width: 6;
          stroke-opacity: 0.8;
          stroke: #ff9900;
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