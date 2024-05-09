function drawRadialPlot(data){
    d3.select('#radialChart').selectAll('*').remove();


       const width = 320;
            const height = 320;
            const innerRadius = 60;
            const outerRadius = Math.min(width, height) / 2 - 30;
            const svg = d3.select("#radialChart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2 + 20})`);


            // Tooltip setup
            const tooltip = d3.select("#radialChart").append("div")
                .attr("class", "tooltipclassic")
                .style("position", "absolute")
                .style("visibility", "hidden");

            // Add title to the SVG
            svg.append("text")
                .attr("class", "chart-title")
                .attr("x", 0)
                .attr("y", -(height / 2))  // Adjust the y offset to place the title appropriately
                .attr("text-anchor", "middle")
                // .style("font-size", "12px")
                .style("fill", "white")
                .text("Constellation Frequency");

            // svg.append("text")
            //     .attr("class", "chart-title")
            //     .attr("x", 0)
            //     .attr("y", -(height / 2) + 20)  // Adjust the y offset to place the title appropriately
            //     .attr("text-anchor", "middle")
            //     .style("font-size", "12px")
            //     .style("fill", "white")
            //     .text("observations per constellation");

            const x = d3.scaleBand()
                .range([0, 2 * Math.PI])
                .align(0);

            const y = d3.scaleRadial()
                .range([innerRadius, outerRadius]);

            const z = d3.scaleOrdinal()
                .range([colors[0], colors[1]]);

            x.domain(data.map(d => d['Sun Constellation']));
            const maxVal = d3.max(data, d => d.Daytime + d.Nighttime);
            y.domain([0, maxVal]);
            z.domain(['Daytime', 'Nighttime']);

            const arcGenerator = d3.arc()
                .innerRadius(d => y(d[0]))
                .outerRadius(d => y(d[1]))
                .startAngle(d => x(d.data['Sun Constellation']))
                .endAngle(d => x(d.data['Sun Constellation']) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius);

            /*let selectedConstellations = ["Sagittarius", "Capricornus", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpius", "Ophiuchus"];*/

            const layerGroups = svg.append("g")
                .selectAll("g")
                .data(d3.stack().keys(['Daytime', 'Nighttime'])(data))
                .enter().append("g")
                .attr("fill", d => z(d.key));

            const arcs = layerGroups.selectAll("path")
                .data(d => d)
                .enter().append("path")
                .attr("d", arcGenerator)
                //.style("opacity", 0.5)
                .on("click", function (event, d) {
                    const constellation = d.data['Sun Constellation'];
                    const isActive = selectedConstellations.includes(constellation);
                    if (isActive) {
                        selectedConstellations = selectedConstellations.filter(c => c !== constellation);
                        svg.selectAll('path').filter(dd => dd.data['Sun Constellation'] === constellation)
                            .transition().style("opacity", 0.5);

                    } else {
                        selectedConstellations.push(constellation);
                        svg.selectAll('path').filter(dd => dd.data['Sun Constellation'] === constellation)
                            .transition().style("opacity", 1);
                    }
                    fetchandRenderScatterPlot();
                    // fetchandRenderMDSPlot();
                    fetchandRenderDonut();
                    fetchandRenderChoropleth();
                    //fetchandRenderRadialPlot();
                    fetchandRenderTimeSeriesPlot();
                })
                .style("cursor", "pointer")
                .on("mouseover", function (event, d) {
                    const tooltipWidth = 150; // Adjust based on your tooltip content and style
                    const tooltipHeight = 50; // Adjust based on your tooltip content and style

                    const mouseX = d3.pointer(event)[0];
                    const mouseY = d3.pointer(event)[1];

                    const mapContainer = document.getElementById("radialChart");
                    const mapRect = mapContainer.getBoundingClientRect();
                    const mapWidth = mapRect.width;
                    const mapHeight = mapRect.height;

                    let tooltipX = mouseX + 10; // Initial position offset
                    let tooltipY = mouseY - 10; // Initial position offset

                    // Check if tooltip exceeds map width
                    if (tooltipX + tooltipWidth > mapWidth) {
                        tooltipX = mapWidth - tooltipWidth - 10; // Adjusting position to stay within the map
                    }

                    // Check if tooltip exceeds map height
                    if (tooltipY + tooltipHeight > mapHeight) {
                        tooltipY = mapHeight - tooltipHeight - 10;
                        // console.log(tooltipY) // Adjusting position to stay within the map
                    }

                    tooltip.style("visibility", "visible")
                        .html(d.data['Sun Constellation'])
                        .style("top", tooltipY + 150+ "px")
                        .style("left", tooltipX + 150 +"px");
                })
                .on("mouseout", function (d) {
                    tooltip.style("visibility", "hidden");
                });

            var levels = 2;
            var levelStep = (outerRadius - innerRadius) / (levels + 1);

            var g = svg.select("g");

            d3.selection.prototype.moveToFront = function () {
                return this.each(function () {
                    this.parentNode.appendChild(this);
                });
            };

            var yAxis = g.select("g")
                .attr("text-anchor", "middle");

            yAxis.selectAll('circle')
                .data(d3.range(1, levels + 1))
                .enter()
                .append('circle')
                .attr('r', d => innerRadius + levelStep * d)
                .style('fill', 'none')
                .style('stroke', 'white')
                .style('stroke-opacity', 1.0)
                .style('stroke-dasharray', '2,2');

            yAxis.selectAll('text')
                .data(d3.range(1, levels + 1))
                .enter()
                .append('text')
                .attr('y', d => -(innerRadius + levelStep * d))
                .attr('dy', '-0.4em')
                .attr('fill', 'white')
                .style('font-size', '10px')
                .text(d => Math.round(maxVal / levels * d));

            g.append("g")
                .selectAll("text")
                .data(data)
                .enter().append("text")
                .attr("transform", d => `rotate(${(x(d['Sun Constellation']) + x.bandwidth() / 2) * 180 / Math.PI - 90})translate(${innerRadius - 20}, 0)`)
                .attr("dy", "0.35em")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .text(d => d['Sun Constellation'].substring(0, 3).toUpperCase());

            yAxis.moveToFront();


            // Define legend data
    const legendData = [{ label: "Nighttime", color: "#bc6ceb" }, { label: "Daytime", color: "#6ceb6c" }];

    // Add legend to the SVG
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(-150, -130)"); // Adjust the position as needed

    // Create rectangles for legend categories
    legend.selectAll("rect")
        .data(legendData)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", d => d.color);

    // Add labels for legend categories
    legend.selectAll("text")
        .data(legendData)
        .enter().append("text")
        .attr("x", 15)
        .attr("y", (d, i) => i * 20 + 9) // Adjust position to vertically center text
        .style("font-size", "12px")
        .style("fill", "white")
        .text(d => d.label);
}
