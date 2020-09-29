// Reference - https://www.d3-graph-gallery.com/graph/parallel_custom.html
var margin = {top: 100, right: 50, bottom: 10, left: 50},
    width = 1200- margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// Creates sources <svg> element
const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right+150)
    .attr("height", height + margin.top + margin.bottom);

// Group used to enforce margin
const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("cars.csv")
    .then((data) => {
        data = data.filter((d,i)=>{ return i < 1000;});
        var color = d3.scaleOrdinal()
            .domain(Array.from(new Set(d3.map(data, function(d){return d["Identification.Make"];}))))
            .range(d3.schemeCategory10);

        var dimensions = ["Dimensions.Height","Dimensions.Length","Dimensions.Width","Engine Information.Engine Statistics.Horsepower","Engine Information.Engine Statistics.Torque"];
        var yaxis = {};

        for (i in dimensions) {
                var name = dimensions[i];
                yaxis[name] = d3.scaleLinear()
                    .domain(d3.extent(data, (d) => {
                            return Number(d[name]);
                    }))
                    .range([height, 0])
        }
         var xaxis  = d3.scalePoint()
                .range([0, width])
                .domain(dimensions);

         function path(d) {
                 return d3.line()(dimensions.map(function(p) { return [margin.left+100 + xaxis(p), margin.top+yaxis[p](d[p])]; }));
         }



         svg.selectAll("myPath")
             .data(data)
             .enter()
             .append("path")
             .attr("class", function (d) { return "line " + d["Identification.Make"] } )
             .attr("d",  path)
             .style("fill", "none" )
             .style("stroke", function(d){ return( color(d["Identification.Make"]))} )
             .style("opacity", 0.5)
             .on("mouseover", function(data, i){

                 selected_specie = i["Identification.Make"];
                 console.log(i["Identification.Make"]);
                 d3.selectAll(".line")
                     .transition().duration(200)
                     .style("stroke", "lightgrey")
                     .style("opacity", "0.5");
                 d3.selectAll("." + selected_specie)
                     .transition().duration(200)
                     .style("stroke", color(selected_specie))
                     .style("opacity", "1")
             })
             .on("mouseleave", function(d,i){
                 d3.selectAll(".line")
                     .transition().duration(200).delay(1000)
                     .style("stroke", function(d,i){ return( color(d["Identification.Make"]))} )
                     .style("opacity", "1")
             });

            svg.selectAll("myAxis")
                .data(dimensions).enter()
                .append("g")
                .attr("class", "axis")
                .attr("transform", function(d) { return "translate(" + (margin.left+100 +xaxis(d)) + ", "+ margin.top+" )"; })
                .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(yaxis[d])); })
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d; })
                .style("fill", "black");
            svg.append("g")
                .append("text")
                .text("Parallel Co-ordinates")
                .style("text-anchor", "middle")
                .attr("transform", `translate(${margin.left+600}, ${margin.top- 50})`);


    }).catch((error) => {
    console.error(error);
});
