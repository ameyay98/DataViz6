// Reference - https://observablehq.com/@d3/scatterplot-matrix

const margin = { top: 100, bottom: 40, left: 150, right: 20 };
const width = 1200;
const height = 750;
const padding = 20;

const svg = d3.select("body")
    .append("svg")
    .attr("viewBox", `${-padding} 0 ${width} ${width}`)
    .style("max-width", "100%")
    .style("height", "auto");
var newColumns = ["Dimensions.Height","Fuel Information.Highway mpg","Engine Information.Engine Statistics.Torque", "Engine Information.Engine Statistics.Horsepower"];
var size = size = (width - (newColumns.length + 1) * padding) / newColumns.length + padding;

d3.csv("cars.csv")
    .then((data) => {
        data = data.filter((d,i) =>{return i < 500} );
        var x = newColumns.map(c => d3.scaleLinear()
            .domain(d3.extent(data, d => Number(d[c])))
            .rangeRound([padding/2, size - padding/2]));
        var y = x.map(x => x.copy().range([size - padding/2, padding/2 ]));

        var z = d3.scaleOrdinal()
            .domain(data.map(d => d["Engine Information.Driveline"]))
            .range(d3.schemeCategory10);
        console.log(x);
        console.log(y);

        const xaxis = d3.axisBottom()
            .ticks(6)
            .tickSize(size * newColumns.length);

        svg.append("g").selectAll("g").data(x).join("g")
            .attr("transform", (d, i) => `translate(${i * size},0)`)
            .each(function(d) { return d3.select(this).call(xaxis.scale(d)); })
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));

        const yaxis = d3.axisLeft()
                .ticks(6)
                .tickSize(-size * newColumns.length);
        svg.append("g").selectAll("g").data(y).join("g")
                .attr("transform", (d, i) => `translate(0,${i * size})`)
                .each(function(d) { return d3.select(this).call(yaxis.scale(d)); })
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));

        const cell = svg.append("g")
            .selectAll("g")
            .data(d3.cross(d3.range(newColumns.length), d3.range(newColumns.length)))
            .join("g")
            .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);
        cell.append("rect")
            .attr("fill", "none")
            .attr("stroke", "#aaa")
            .attr("x", padding / 2 + 1)
            .attr("y", padding / 2 + 1)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.each(function([i, j]) {
            d3.select(this).selectAll("circle")
                .data(data.filter(d => !isNaN(d[newColumns[i]]) && !isNaN(d[newColumns[j]])))
                .join("circle")
                .attr("cx", d => x[i](d[newColumns[i]]))
                .attr("cy", d => y[j](d[newColumns[j]]));
        });

        const circle = cell.selectAll("circle")
            .attr("r", 3.5)
            .attr("fill-opacity", 0.7)
            .attr("fill", d => z(d["Engine Information.Driveline"]));

        svg.append("g")
            .style("font", "bold 10px sans-serif")
            .selectAll("text")
            .data(newColumns)
            .join("text")
            .attr("transform", (d, i) => `translate(${i * size},${i * size})`)
            .attr("x", padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text(d => d);



    })
    .catch((error)=>{
        console.log(error);
    });