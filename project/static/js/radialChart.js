document.addEventListener('DOMContentLoaded', function () {
    fetch('/radialChart')  // Make sure this matches the correct Flask endpoint
        .then(response => response.json())
        .then(data => {
            var svg = d3.select("#radialChart")
                .append("svg")
                .attr("width", 400)  // Responsive based on parent div
                .attr("height", 400)  // Responsive based on parent div
                //.attr("viewBox", [-width / 2, -height / 2, width, height]);  // Ensure SVG centers the chart

            //var width = +svg.node().getBoundingClientRect().width;
            //var height = +svg.node().getBoundingClientRect().height;
            var width = 400;
            var height = 400;
            var innerRadius = 100,  // Adjust as needed
                outerRadius = Math.min(width, height) / 2 - 20;  // Leave some margins

            var x = d3.scaleBand()
                .range([0, 2 * Math.PI])
                .align(0);

            var y = d3.scaleRadial()
                .range([innerRadius, outerRadius]);

            var z = d3.scaleOrdinal()
                .range(["#ff7f0e", "#5e2f06"]);  // Colors for Daytime and Nighttime

            x.domain(data.map(function (d) { return d['Sun Constellation']; }));
            var maxVal = d3.max(data, d => d.Daytime + d.Nighttime);
            y.domain([0, maxVal]);
            z.domain(['Daytime', 'Nighttime']);

            var g = svg.append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            // Draw circular grid lines and labels
            var yAxis = g.append("g")
                .attr("text-anchor", "middle");

            var levels = 2; // Number of levels in the grid
            var levelFactor = outerRadius / levels;

            yAxis.selectAll('circle')
                .data(d3.range(1, levels + 1))
                .enter()
                .append('circle')
                .attr('r', d => levelFactor * d)
                .style('fill', 'none')
                .style('stroke', 'white')
                .style('stroke-dasharray', '2,2');

            //yAxis.selectAll('text')
            //    .data(d3.range(1, levels + 1))
            //    .enter()
            //    .append('text')
            //    .attr('y', d => -levelFactor * d)
            //    .attr('dy', '-0.4em')
            //    .attr('fill', 'white')
            //    .text(d => Math.round(maxVal / levels * d));

            var arcs = d3.arc()
                .innerRadius(d => y(d[0]))
                .outerRadius(d => y(d[1]))
                .startAngle(d => x(d.data['Sun Constellation']))
                .endAngle(d => x(d.data['Sun Constellation']) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius);

            var groups = g.append("g")
                .selectAll("g")
                .data(d3.stack().keys(['Daytime', 'Nighttime'])(data))
                .enter().append("g")
                .attr("fill", d => z(d.key));

            groups.selectAll("path")
                .data(d => d)
                .enter().append("path")
                .attr("d", arcs);

            // Add constellation labels inside the donut hole
            g.append("g")
                .selectAll("text")
                .data(data)
                .enter().append("text")
                .attr("transform", d => `rotate(${(x(d['Sun Constellation']) + x.bandwidth() / 2) * 180 / Math.PI - 90})translate(${innerRadius-25}, 0)`)
                .attr("dy", "0.35em")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .text(d => d['Sun Constellation']);

            
        })
        .catch(error => console.error('Error:', error));
});
