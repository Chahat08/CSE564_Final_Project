function drawTimeseriesPlot(timeseriesdata) {

    d3.select('#TimeseriesPlot').selectAll('*').remove();


    // Set up the dimensions and margins for the plot
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 560 - margin.left - margin.right;
    const height = 340 - margin.top - margin.bottom;

    // Append the SVG to a container element
    const svg = d3.select("#TimeseriesPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse the data
    timeseriesdata.forEach(function(d) {
        d.Decade = +d.Decade;
        d['Eclipse Magnitude'] = +d['Eclipse Magnitude'];
    });

    // Group data by decade and calculate the average magnitude for each decade
    const avgMagnitudeByDecade = d3.rollup(
        timeseriesdata,
        v => d3.mean(v, d => d['Eclipse Magnitude']),
        d => d.Decade
    );

    // Convert map to array for easier processing
    const avgMagnitudeData = Array.from(avgMagnitudeByDecade, ([Decade, Magnitude]) => ({ Decade, Magnitude }));

    // Set up scales for x and y axes
    const xScale = d3.scaleLinear()
        .domain([d3.min(avgMagnitudeData, d => d.Decade), d3.max(avgMagnitudeData, d => d.Decade)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(avgMagnitudeData, d => d.Magnitude) - 0.05, d3.max(avgMagnitudeData, d => d.Magnitude)])
        .range([height, 0]);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    // Append x and y axes to the SVG
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    // Create a line generator
    const line = d3.line()
        .x(d => xScale(d.Decade))
        .y(d => yScale(d.Magnitude));

    // Draw the line plot
    svg.append("path")
        .datum(avgMagnitudeData)
        .attr("fill", "none")
        .attr("stroke", colors[0])
        .attr("stroke-width", 1)
        .attr("d", line)

    // Add markers for each data point
    svg.selectAll(".dot")
        .data(avgMagnitudeData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.Decade))
        .attr("cy", d => yScale(d.Magnitude))
        .attr("r", 5) // Increased the radius for better hover interaction
        .attr("fill", colors[4])
        .style("opacity", 0) // Initially hide the dots

    // Add labels and title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top -5)
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Decade");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text("Average Eclipse Magnitude");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "white")
        .text("Trend of Average Eclipse Magnitude Over Decades");

        // Append hover line
    const hoverLine = svg.append("line")
        .attr("class", "hover-line")
        .attr("stroke", "white")
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0);

    // Create a tooltip
    const tooltip = d3.select("#TimeseriesPlot").append("div")
        .attr("class", "tooltipclassic")
        .style("position", "absolute")
        .style("visibility", "hidden");

    svg.on("mousemove", function(event) {
            const [xCoord, yCoord] = d3.pointer(event);
            // console.log("X: ", xCoord)
            const decade = Math.round(xScale.invert(xCoord) / 10) * 10;

            // console.log("Y:" ,yCoord)
            const magnitude = avgMagnitudeByDecade.get(decade);
            if (magnitude !== undefined && yCoord > 0) {

                hoverLine.attr("x1", xScale(decade))
                .attr("y1", 0)
                .attr("x2", xScale(decade))
                .attr("y2", height)
                .style("opacity", 1);


                const tooltipWidth = 150; // Adjust based on your tooltip content and style
                const tooltipHeight = 50; // Adjust based on your tooltip content and style
                const mouseX = d3.pointer(event)[0];
                const mouseY = d3.pointer(event)[1];
                const mapContainer = document.getElementById("TimeseriesPlot");
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
                    .html(`<strong>Decade: </strong>${decade}<br/><strong>Magnitude: </strong>${magnitude.toFixed(2)}`)
                    .style("top", tooltipY + "px")
                    .style("left", tooltipX + "px");

                svg.selectAll(".dot")
                .style("opacity", d => d.Decade === decade ? 1 : 0);
                // Show decade and magnitude on mousemove
                // console.log(`Decade: ${decade}, Magnitude: ${magnitude}`);

            }
        });

    svg.on("mouseout", function() {
        hoverLine.style("opacity", 0);
        tooltip.style("visibility", "hidden");
        svg.selectAll(".dot")
                .style("opacity", 0);
    });

    // Create a brush
    const brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("brush", brushed)
        .on("end", brushended);

    // Append brush to the SVG
    const brushG = svg.append("g")
        .attr("class", "brush")
        .call(brush);

    function brushed(event) {
        const selection = event.selection;
        if (selection) {
            const [x0, x1] = selection.map(xScale.invert);
            console.log("Selected decades:", [Math.round(x0), Math.round(x1)]);

            selected_decades = [Math.round(x0), Math.round(x1)]
        }
    }

    let isBrushCleared = false;

    function brushended(event) {
        if (event.selection) {
            console.log("hi")
            const [x0, x1] = event.selection.map(xScale.invert);
            console.log("Selected decades:", [Math.round(x0), Math.round(x1)]);

            selected_decades = [Math.round(x0), Math.round(x1)]
            fetchandRenderScatterPlot();
            fetchandRenderChoropleth();
            fetchandRenderMDSPlot();
            fetchandRenderDonut();
            fetchandRenderRadialPlot();
        }
        else {
            // If brush is cleared programmatically, don't trigger again
            if (!isBrushCleared) {
                isBrushCleared = true;
                console.log("No brush");
                brushG.call(brush.move, null);
                selected_decades = [];
                fetchandRenderScatterPlot();
                fetchandRenderChoropleth();
                fetchandRenderMDSPlot();
                fetchandRenderDonut();
                fetchandRenderRadialPlot();
                 // Set flag to true
            } else {
                isBrushCleared = false; // Reset flag
            }
    }
    }
}