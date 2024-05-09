document.addEventListener('DOMContentLoaded', function () {
    fetch('/donut')
        .then(response => response.json())
        .then(data => {
            const width = 320;
            const height = 320;
            const margin = 20;
            const radius = Math.min(width, height) / 2 - margin;
            const innerRadius = radius * 0.5;

            const svg = d3.select("#donutChart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            const color = d3.scaleOrdinal()
                .domain(Object.keys(data))
                .range(["#ff7f0e", "#d62728", "#ebd271" ,"#fcc203"]);  // Warm color palette

            const pie = d3.pie()
                .value(d => d[1])
                .sort(null);
            const data_ready = pie(Object.entries(data));

            const arcGenerator = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius);

            const total = d3.sum(data_ready, d => d.value);  // Calculate total for percentage

            svg.selectAll('path')
                .data(data_ready)
                .enter()
                .append('path')
                .attr('d', arcGenerator)
                .attr('fill', d => color(d.data[0]))
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 1.0);

            // Adding text to the pies (percentages)
            svg.selectAll('text.slice')
                .data(data_ready)
                .enter().append("text")
                .attr("class", "slice")
                .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
                .attr("dy", "5px")
                .attr("text-anchor", "middle")
                .text(d => `${(d.value / total * 100).toFixed(1)}%`)
                .style("fill", "white")
                .style("font-size", "12px");

            // Legend in the center
            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("text-anchor", "middle")  // Center the text
                .selectAll("legend")
                .data(data_ready)
                .enter().append("g")
                .attr("transform", (d, i) => `translate(0, ${-innerRadius / 2 + i * 20})`);  // Position legends

            legend.append("rect")  // Color squares
                .attr("x", -35)  // Adjust x position to left a bit
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", d => color(d.data[0]));

            legend.append("text")  // Legend text
                .attr("x", 5)  // Text offset from the square
                .attr("y", 10)
                .text(d => d.data[0])
                .style("fill", "white")
                .style("font-size", "12px");
        })
        .catch(error => console.error('Error:', error));
});