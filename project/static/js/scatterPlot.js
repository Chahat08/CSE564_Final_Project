
function drawScatterPlot(data)
{

    d3.select('#scatterPlot').selectAll('*').remove();

    //console.log(data)
            // Populate dropdown menus with data columns
            // var allVariables = Object.keys(data[0]);
            var allVariables = ['Delta T (s)','Gamma', 'Eclipse Magnitude', 'Sun Altitude',
            'Sun Azimuth',  'Eclipse Latitude','Eclipse Longitude', 'obliquity', 'Inter-Eclipse Duration',
            'Visibility Score', 'Moon Distance (km)', 'Sun Distance (km)', 'Decade']
            var selectX = d3.select('#xAxisSelect');
            var selectY = d3.select('#yAxisSelect');

            allVariables.forEach(function (key) {
                selectX.append('option').text(key).attr('value', key);
                selectY.append('option').text(key).attr('value', key);
            });

            // Set the dimensions and margins of the graph
            var margin = { top: 10, right: 20, bottom: 35, left: 60 },
                width = 540 - margin.left - margin.right,
                height = 290 - margin.top - margin.bottom;

            var svg = d3.select("#scatterPlot").append("svg")
                .attr("width", width + margin.left + margin.right)// + 100)
                .attr("height", height + margin.top + margin.bottom)
                //.style("background-color", "#333")
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            function updatePlot() {
                // Remove previous plot
                svg.selectAll('*').remove();

                // Get selected options
                var selectedX = selectX.property('value');
                var selectedY = selectY.property('value');

                // Create scales for X, Y, radius, and color
                var xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => +d[selectedX]))
                    .range([0, width]);

                var yScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => +d[selectedY]))
                    .range([height, 0]);

                var radiusScale = d3.scaleSqrt()
                    .domain(d3.extent(data, d => +d['Eclipse Magnitude']))
                    .range([1, 1]);

                var colorScale = d3.scaleOrdinal()
                    .domain(['Partial', 'Total', 'Hybrid', 'Annular'])
                    .range(["#ebd271", "#fcc203", "#d62728", "#ff7f0e"]);


                // Format numbers in millions
                function formatMillions(num) {
                    return (num / 1000000);
                }

                // Conditionally format X axis
                var xAxis = d3.axisBottom(xScale);
                if (selectedX === "Sun Distance (km)") {
                    xAxis.tickFormat(formatMillions);
                }

                // Conditionally format Y axis
                var yAxis = d3.axisLeft(yScale);
                if (selectedY === "Sun Distance (km)") {
                    yAxis.tickFormat(formatMillions);
                }

                // Add axes
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
                //.call(d3.axisBottom(xScale));

                svg.append("g")
                    .call(yAxis);
                //.call(d3.axisLeft(yScale));

                // Function to determine eclipse type from the Eclipse Type string
                function classifyEclipseType(typeString) {
                    if (typeString.includes('P')) return 'Partial';
                    if (typeString.includes('T')) return 'Total';
                    if (typeString.includes('H')) return 'Hybrid';
                    if (typeString.includes('A')) return 'Annular';
                    return 'Unknown'; // Default case
                }



                // Draw scatterplot
                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", d => xScale(d[selectedX]))
                    .attr("cy", d => yScale(d[selectedY]))
                    .attr("r", d => radiusScale(d['Eclipse Magnitude']))
                    .attr("fill", d => colorScale(classifyEclipseType(d['Eclipse Type'])))
                    .attr("opacity", 0.5);
                //.attr("stroke", "black");

                svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", height + margin.bottom - 5)
                    .style("text-anchor", "middle")
                    .style("fill", "white")
                    .text(selectedX === "Sun Distance (km)" ? "Sun Distance (million km)" : selectedX)
                    .attr("font-size", 12);

                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left + 5)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style("fill", "white")
                    .text(selectedY === "Sun Distance (km)" ? "Sun Distance (million km)" : selectedY)
                    .attr("font-size", 12);


                // Draw legend
                //var legend = svg.append("g")
                //    .attr("transform", "translate(" + (width + 15) + ", 20)"); // Adjust position as needed

                //['P', 'T', 'H', 'A'].forEach((type, index) => {
                //    var legendRow = legend.append("g")
                //        .attr("transform", "translate(0, " + index * 20 + ")");

                //    legendRow.append("rect")
                //        .attr("width", 10)
                //        .attr("height", 10)
                //        .attr("fill", colorScale(type));

                //    legendRow.append("text")
                //        .attr("x", 20)
                //        .attr("y", 10)
                //        .attr("text-anchor", "end")
                //        .style("text-transform", "capitalize")
                //        .text(type)
                //        .style("fill", "white")
                //        .attr("font-size", 10);
                //});
                    
            }

            // Initial plot
            updatePlot();

            // Event listeners for dropdown changes
            selectX.on("change", updatePlot);
            selectY.on("change", updatePlot);
}