document.addEventListener('DOMContentLoaded', function () {
    fetch('/donut')
        .then(response => response.json())
        .then(data => {
            const width = 320;
            const height = 320;
            const margin = 20;
            const radius = Math.min(width, height) / 2 - margin;
            const innerRadius = radius * 0.5;
            const outerRadius = radius * 1.1;  // Extend outer radius for label placement

            const svg = d3.select("#donutChart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            const color = d3.scaleOrdinal()
                .domain(Object.keys(data))
                .range(["#ff7f0e", "#d62728", "#ebd271", "#fcc203"]);

            const pie = d3.pie()
                .value(d => d[1])
                .sort(null);
            const data_ready = pie(Object.entries(data));

            const arcGenerator = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius);

            const arcHover = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius + 10);  // Larger radius for the selected segment

            const arcs = svg.selectAll('path')
                .data(data_ready)
                .enter()
                .append('path')
                .attr("stroke", "black")
                .style("stroke-width", "3px")
                .style("opacity", 1.0) // Initially all are partially opaque
                .style("cursor", "pointer")
                .attr('fill', d => color(d.data[0]))
                .attr('d', arcHover);

            let selectedTypes = ["Partial", "Annular", "Total", "Hybrid"];

            // Interaction for clicking on segments
            arcs.on("click", function (event, d) {
                const index = selectedTypes.indexOf(d.data[0]);
                if (index > -1) {
                    // Already selected, remove it
                    selectedTypes.splice(index, 1);
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('d', arcGenerator)
                        .style('opacity', 0.5);
                } else {
                    // Add to selection
                    selectedTypes.push(d.data[0]);
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('d', arcHover)
                        .style('opacity', 1);
                }

                // Update the legend accordingly
                svg.selectAll('.legend text')
                    .style("font-weight", function (labelData) {
                        return selectedTypes.includes(labelData.data[0]) ? "bold" : "normal";
                    })
                    .style("font-size", function (labelData) {
                        return selectedTypes.includes(labelData.data[0]) ? "15px" : "12px";
                    });
            });

             // Adding text to the outer edge of the pies (percentages)
            const total = d3.sum(data_ready, d => d.value);
            //svg.selectAll('text.slice')
            //    .data(data_ready)
            //    .enter().append("text")
            //    .attr("class", "slice")
            //    .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            //    .attr("dy", "0px")
            //    .attr("text-anchor", "middle")
            //    .text(d => `${(d.value / total * 100).toFixed(1)}%`)
            //    .style("fill", "white")
            //    .style("font-size", "12px");
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
                .attr("text-anchor", "middle")
                .selectAll("legend")
                .data(data_ready)
                .enter().append("g")
                .attr("transform", (d, i) => `translate(0, ${-innerRadius / 2 + i * 20})`);

            

            legend.append("rect")
                .attr("x", -35)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", d => color(d.data[0]));

            legend.append("text")
                .attr("x", 10)
                .attr("y", 10)
                .text(d => d.data[0])
                .style("fill", "white")
                .style("font-size", "15px");
        })
        .catch(error => console.error('Error:', error));
});