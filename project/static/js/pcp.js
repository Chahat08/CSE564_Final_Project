document.addEventListener('DOMContentLoaded', function () {

    fetch('/pcp')
        .then(response => response.json())
        .then(data => {
            let dragging = {};
            var margin = { top: 10, right: 30, bottom: 30, left: 40 },
                width = 1000 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            const svg = d3.select("#pcp")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .style("background-color", "#333"); // Dark background color

            let variables = ["Decade", "ESC Wide-Scale Moving Average", "Eclipse Interval", "EII", "Localized ESC"];
            const y = {};
            variables.forEach(variable => {
                y[variable] = d3.scaleLinear()
                    .domain(d3.extent(data, d => d[variable]))
                    .range([height, 40]);
            });

            let x = d3.scalePoint()
                .domain(variables)
                .range([50, width-50]);

            function position(d) {
                var v = dragging[d];
                return v == null ? x(d) : v;
            }

            function transition(g) {
                return g.transition().duration(500);
            }

            function path(d) {
                return d3.line()(variables.map(function(p) {
                    return [position(p), y[p](d[p])];
                }));
            }

            const colorScale = d3.scaleOrdinal()
                .domain(["A", "T", "H"])
                .range(["#ff7f0e", "#d62728", "#bcbd22"]);

            svg.selectAll("myPath")
                .data(data)
                .enter().append("path")
                .attr("d", d => path(d))
                .attr("class", "line")
                .style("fill", "none")
                .style("stroke", d => {
                    // Apply color based on the "Type" field
                    if (d["Eclipse Type"].includes("A")) return colorScale("A");
                    if (d["Eclipse Type"].includes("T")) return colorScale("T");
                    if (d["Eclipse Type"].includes("H")) return colorScale("H");
                    return "#ccc";  // Default color if none of the types match
                }) // Light gray lines
                .style("opacity", 0.8);

            const axis = svg.selectAll(".axis")
                .data(variables)
                .enter().append("g")
                .attr("class", "axis")
                .attr("transform", d => "translate(" + x(d) + ")")
                .each(function(d) {
                    d3.select(this).call(d3.axisLeft().scale(y[d]))
                        .selectAll("text")
                        .style("fill", "#fff"); // White text for labels
                    d3.select(this).selectAll("line,path")
                        .style("stroke", "#777"); // Lighter strokes for axes
                })
                .style("cursor", "col-resize");

            axis.append("text")
                .attr("class", "axis-label")
                .style("text-anchor", "middle")
                .attr("y", 12)
                .text(function(d) { return d; })
                .style("fill", "#fff"); // White text for axis labels

            axis.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

            function dragstarted(event, d) {
                dragging[d] = x(d);
                svg.selectAll("path")
                    .style("opacity", 0.2);
            }

            function dragged(event, d) {
                dragging[d] = Math.min(width, Math.max(0, event.x));
                variables.sort(function(a, b) { return position(a) - position(b); });
                x.domain(variables);
                axis.attr("transform", function(d) { return "translate(" + position(d) + ")"; });
                svg.selectAll("path").attr("d", d => path(d));
            }

            function dragended(event, d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(svg.selectAll("path").data(data))
                    .attr("d", d => path(d))
                    .style("opacity", 0.8);
            }

            /*svg.append("text")
                .attr("x", (width / 2))
                .attr("y", margin.top + )
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .text("PCP Chart")
                .style("fill", "#fff");*/ // Title in white

            window.reorderAxesGlobal = function reorderAxes(orderedAttributes) {
                const updatedOrder = orderedAttributes.concat(variables.filter(attr => !orderedAttributes.includes(attr)));
                variables = updatedOrder;
                x.domain(updatedOrder);
                svg.selectAll(".axis")
                    .transition()
                    .duration(500)
                    .attr("transform", d => `translate(${x(d)})`);
                svg.selectAll(".line")
                    .data(data)
                    .join(
                        enter => enter.append("path")
                                      .attr("class", "line")
                                      .attr("d", d => path(d)),
                        update => update
                    )
                    .transition()
                    .duration(500)
                    .attr("d", d => path(d));
            };
        })
        .catch(error => console.error('Error:', error));
});
