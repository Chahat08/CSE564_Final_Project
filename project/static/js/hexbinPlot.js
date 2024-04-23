document.addEventListener('DOMContentLoaded', function () {
    fetch('/hexbin_plot')
        .then(response => response.json())
        .then(data => {
            // Populate dropdown menus with data columns
            var allVariables = Object.keys(data[0]);
            var selectX = d3.select('#xAxisSelect');
            var selectY = d3.select('#yAxisSelect');

            allVariables.forEach(function (key) {
                selectX.append('option').text(key).attr('value', key);
                selectY.append('option').text(key).attr('value', key);
            });

            // Set the dimensions and margins of the graph
            var margin = { top: 10, right: 30, bottom: 30, left: 40 },
                width = 460 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            var svg = d3.select("#hexbinPlot").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("background-color", "#333") 
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            function updatePlot() {
                // Remove previous plot
                svg.selectAll('*').remove();

                // Get selected options and bin count
                var selectedX = selectX.property('value');
                var selectedY = selectY.property('value');
                var bins = parseInt(document.getElementById('binCount').value);

                var x = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) { return +d[selectedX]; }))
                    .range([0, width]);

                var y = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) { return +d[selectedY]; }))
                    .range([height, 0]);

                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .style("color", "white");

                svg.append("g")
                    .call(d3.axisLeft(y))
                    .style("color", "white");

                var inputForHexbinFun = data.map(function (d) {
                    return [x(+d[selectedX]), y(+d[selectedY])];
                });

                var color = d3.scaleLinear()
                    .domain([0, bins]) // Update this based on actual data density if necessary
                    .range(["transparent", "#69b3a2"]);

                var hexbin = d3.hexbin()
                    .radius(9) // Using the number of bins input for radius size
                    .extent([[0, 0], [width, height]]);

                svg.append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                svg.append("g")
                    .attr("clip-path", "url(#clip)")
                    .selectAll("path")
                    .data(hexbin(inputForHexbinFun))
                    .enter().append("path")
                    .attr("d", hexbin.hexagon())
                    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
                    .attr("fill", function (d) { return color(d.length); })
                    .attr("stroke", "white")
                    .attr("stroke-width", "0.1");
            }

            // Initial plot
            updatePlot();

            // Event listeners for dropdown changes
            selectX.on("change", updatePlot);
            selectY.on("change", updatePlot);
            d3.select('#binCount').on("input", updatePlot);
        })
        .catch(error => console.error('Error:', error));
});
