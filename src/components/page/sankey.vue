<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item><i class="el-icon-upload"></i> Test</el-breadcrumb-item>
                <el-breadcrumb-item>桑基图</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-button
                @click="a">
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
            a() {
                this.load();
            },
            load() {
                // console.log(sankey());
                // console.log(this.$d3);
                
                var svg = this.$d3.select("svg"),
                    width = +svg.attr("width"),
                    height = +svg.attr("height");
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
                // var json;
                // this.$axios({
                //     url: '/api/sankey',
                //     method: 'get'
                // })
                // .then((response) => {
                //     json = response.data.data;
                //     console.log(json);
                // })
                // .catch((error) => {
                //     console.log(error);
                // });
                // this.$d3.json("/api/sankey", function(error, energy) { console.log(error, energy);});
                var energy = {"nodes":[{"name":"Agricultural 'waste'"},{"name":"Bio-conversion"},{"name":"Liquid"},{"name":"Losses"},{"name":"Solid"},{"name":"Gas"},{"name":"Biofuel imports"},{"name":"Biomass imports"},{"name":"Coal imports"},{"name":"Coal"},{"name":"Coal reserves"},{"name":"District heating"},{"name":"Industry"},{"name":"Heating and cooling - commercial"},{"name":"Heating and cooling - homes"},{"name":"Electricity grid"},{"name":"Over generation / exports"},{"name":"H2 conversion"},{"name":"Road transport"},{"name":"Agriculture"},{"name":"Rail transport"},{"name":"Lighting & appliances - commercial"},{"name":"Lighting & appliances - homes"},{"name":"Gas imports"},{"name":"Ngas"},{"name":"Gas reserves"},{"name":"Thermal generation"},{"name":"Geothermal"},{"name":"H2"},{"name":"Hydro"},{"name":"International shipping"},{"name":"Domestic aviation"},{"name":"International aviation"},{"name":"National navigation"},{"name":"Marine algae"},{"name":"Nuclear"},{"name":"Oil imports"},{"name":"Oil"},{"name":"Oil reserves"},{"name":"Other waste"},{"name":"Pumped heat"},{"name":"Solar PV"},{"name":"Solar Thermal"},{"name":"Solar"},{"name":"Tidal"},{"name":"UK land based bioenergy"},{"name":"Wave"},{"name":"Wind"}],"links":[{"source":0,"target":1,"value":124.729},{"source":1,"target":2,"value":0.597},{"source":1,"target":3,"value":26.862},{"source":1,"target":4,"value":280.322},{"source":1,"target":5,"value":81.144},{"source":6,"target":2,"value":35},{"source":7,"target":4,"value":35},{"source":8,"target":9,"value":11.606},{"source":10,"target":9,"value":63.965},{"source":9,"target":4,"value":75.571},{"source":11,"target":12,"value":10.639},{"source":11,"target":13,"value":22.505},{"source":11,"target":14,"value":46.184},{"source":15,"target":16,"value":104.453},{"source":15,"target":14,"value":113.726},{"source":15,"target":17,"value":27.14},{"source":15,"target":12,"value":342.165},{"source":15,"target":18,"value":37.797},{"source":15,"target":19,"value":4.412},{"source":15,"target":13,"value":40.858},{"source":15,"target":3,"value":56.691},{"source":15,"target":20,"value":7.863},{"source":15,"target":21,"value":90.008},{"source":15,"target":22,"value":93.494},{"source":23,"target":24,"value":40.719},{"source":25,"target":24,"value":82.233},{"source":5,"target":13,"value":0.129},{"source":5,"target":3,"value":1.401},{"source":5,"target":26,"value":151.891},{"source":5,"target":19,"value":2.096},{"source":5,"target":12,"value":48.58},{"source":27,"target":15,"value":7.013},{"source":17,"target":28,"value":20.897},{"source":17,"target":3,"value":6.242},{"source":28,"target":18,"value":20.897},{"source":29,"target":15,"value":6.995},{"source":2,"target":12,"value":121.066},{"source":2,"target":30,"value":128.69},{"source":2,"target":18,"value":135.835},{"source":2,"target":31,"value":14.458},{"source":2,"target":32,"value":206.267},{"source":2,"target":19,"value":3.64},{"source":2,"target":33,"value":33.218},{"source":2,"target":20,"value":4.413},{"source":34,"target":1,"value":4.375},{"source":24,"target":5,"value":122.952},{"source":35,"target":26,"value":839.978},{"source":36,"target":37,"value":504.287},{"source":38,"target":37,"value":107.703},{"source":37,"target":2,"value":611.99},{"source":39,"target":4,"value":56.587},{"source":39,"target":1,"value":77.81},{"source":40,"target":14,"value":193.026},{"source":40,"target":13,"value":70.672},{"source":41,"target":15,"value":59.901},{"source":42,"target":14,"value":19.263},{"source":43,"target":42,"value":19.263},{"source":43,"target":41,"value":59.901},{"source":4,"target":19,"value":0.882},{"source":4,"target":26,"value":400.12},{"source":4,"target":12,"value":46.477},{"source":26,"target":15,"value":525.531},{"source":26,"target":3,"value":787.129},{"source":26,"target":11,"value":79.329},{"source":44,"target":15,"value":9.452},{"source":45,"target":1,"value":182.01},{"source":46,"target":15,"value":19.013},{"source":47,"target":15,"value":289.366}]};
                // energy = JSON.parse(json);
                // console.log(energy.nodes);
                // console.log(energy.links);
                var graph = ss(energy);
                // console.log(energy.nodes);
                // console.log(energy.links);

                var link = svg.append("g")
                    .attr("class", "links")
                    .attr("fill", "none")
                    .attr("stroke", "#000")
                    .attr("stroke-opacity", 0.2)
                    .selectAll("path")
                    .data(energy.links)
                      .enter().append("path")
                    .attr("d", sankeyLinkHorizontal())
                    .attr("stroke-width", function(d) { return Math.max(1, d.width); });

                var node = svg.append("g")
                    .attr("class", "nodes")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .selectAll("g")
                    .data(energy.nodes)
                    .enter().append("g");
                    // .call(this.$d3.drag()
                    //         .on("start", dragstarted)
                    //         .on("drag", dragged)
                    //         .on("end", dragended));

                var dx, dy0, dy;
                function dragstarted(d) {
                    console.log("Drag Start");
                  console.log(graph.nodes[0]);
                  // console.log(d);
                  dx = d.x0;
                  dy = (d.y0 + d.y1) / 2;
                  dy0 = d.y0;
                }

                function dragged(d) {
                    console.log("Drag Move");
                  console.log('y', this.$d3.event.y-dy);
                  // console.log("dx", this.$d3.event.x, "dy", this.$d3.event.y);
                  // console.log(d);
                  this.$d3.select(this)
                    .attr("x", dx)
                    .attr("y", this.$d3.event.y-dy+dy0)
                    .attr("transform", "translate(" + 0 + "," + (this.$d3.event.y-dy) + ")");
                  graph = ss.update(graph);
                  link = link.attr("d", sankeyLinkHorizontal());
                }

                function dragended(d) {
                    console.log("Drag End");
                  // console.log("event", this.$d3.event);
                  // console.log("graph", graph);
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
</style>