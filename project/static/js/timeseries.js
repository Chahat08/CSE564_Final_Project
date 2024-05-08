document.addEventListener('DOMContentLoaded', function () {

    fetch('/timeseries')
        .then(response => response.json())
        .then(data => {
            console.log("Timeseries data: ", data)
            drawTimeseriesPlot(data)

        }).catch(error => console.error('Error:', error));

});


// function drawTimeseriesPlot(timeseriesdata) {
//     // Set up the dimensions and margins for the plot
//     const margin = { top: 50, right: 50, bottom: 50, left: 50 };
//     const width = 800 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;
  
//     // Append the SVG to a container element
//     const svg = d3.select("#TimeseriesPlot")
//       .append("svg")
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
//     // Parse the data
//     timeseriesdata.forEach(function(d) {
//       d.Decade = +d.Decade;
//       d['Eclipse Magnitude'] = +d['Eclipse Magnitude'];
//     });

//     // Group data by decade and calculate the average magnitude for each decade
//     const avgMagnitudeByDecade = d3.rollup(
//       timeseriesdata,
//       v => d3.mean(v, d => d['Eclipse Magnitude']),
//       d => d.Decade
//     );

//     // Convert map to array for easier processing
//     const avgMagnitudeData = Array.from(avgMagnitudeByDecade, ([Decade, Magnitude]) => ({ Decade, Magnitude }));
  
//     // Set up scales for x and y axes
//     const xScale = d3.scaleLinear()
//       .domain([d3.min(avgMagnitudeData, d => d.Decade), d3.max(avgMagnitudeData, d => d.Decade)])
//       .range([0, width]);
  
//     const yScale = d3.scaleLinear()
//       .domain([d3.min(avgMagnitudeData, d => d.Magnitude)-0.1, d3.max(avgMagnitudeData, d => d.Magnitude)])
//       .range([height, 0]);
  
//     // Create x and y axes
//     const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
//     const yAxis = d3.axisLeft(yScale);
  
//     // Append x and y axes to the SVG
//     svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);
  
//     svg.append("g")
//       .call(yAxis);
  
//     // Create a line generator
//     const line = d3.line()
//       .x(d => xScale(d.Decade))
//       .y(d => yScale(d.Magnitude));
  
//     // Draw the line plot
//     svg.append("path")
//       .datum(avgMagnitudeData)
//       .attr("fill", "none")
//       .attr("stroke", "orange")
//       .attr("stroke-width", 1)
//       .attr("d", line);
  
//     // Add markers for each data point
//     svg.selectAll(".dot")
//       .data(avgMagnitudeData)
//       .enter().append("circle")
//       .attr("class", "dot")
//       .attr("cx", d => xScale(d.Decade))
//       .attr("cy", d => yScale(d.Magnitude))
//       .attr("r", 2)
//       .attr("fill", "red");
  
//     // Add labels and title
//     svg.append("text")
//       .attr("x", width / 2)
//       .attr("y", height + margin.top)
//       .style("text-anchor", "middle")
//       .style("fill" , "white")
//       .text("Decade");
  
//     svg.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left)
//       .attr("x", 0 - (height / 2))
//       .attr("dy", "1em")
//       .style("text-anchor", "middle")
//       .style("fill", "white")
//       .text("Average Eclipse Magnitude");
  
//     svg.append("text")
//       .attr("x", (width / 2))
//       .attr("y", 0 - (margin.top / 2))
//       .attr("text-anchor", "middle")
//       .style("font-size", "16px")
//       .style("fill", "white")
//       .text("Trend of Average Eclipse Magnitude Over Decades");
  
// }

function drawTimeseriesPlot(timeseriesdata) {
    // Set up the dimensions and margins for the plot
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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
        .domain([d3.min(avgMagnitudeData, d => d.Magnitude) - 0.1, d3.max(avgMagnitudeData, d => d.Magnitude)])
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
        .attr("stroke", "orange")
        .attr("stroke-width", 1)
        .attr("d", line);

    // Add markers for each data point
    svg.selectAll(".dot")
        .data(avgMagnitudeData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.Decade))
        .attr("cy", d => yScale(d.Magnitude))
        .attr("r", 2.5) // Increased the radius for better hover interaction
        .attr("fill", "red")
        .style("opacity", 0) // Initially hide the dots

        // Add hover effect
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 5); // Show dot on hover

            // Draw lines to x and y axes
            svg.append("line")
                .attr("class", "x-hover-line hover-line")
                .attr("x1", xScale(d.Decade))
                .attr("x2", xScale(d.Decade))
                .attr("y1", yScale(d.Magnitude))
                .attr("y2", height)
                .style("stroke", "grey")
                .style("stroke-dasharray", "3,3");

            svg.append("line")
                .attr("class", "y-hover-line hover-line")
                .attr("x1", 0)
                .attr("x2", xScale(d.Decade))
                .attr("y1", yScale(d.Magnitude))
                .attr("y2", yScale(d.Magnitude))
                .style("stroke", "grey")
                .style("stroke-dasharray", "3,3");

            // Add decade and magnitude labels
            svg.append("text")
                .attr("class", "hover-text")
                .attr("x", xScale(d.Decade))
                .attr("y", yScale(d.Magnitude) - 10)
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .text("Decade: " + d.Decade);

            svg.append("text")
                .attr("class", "hover-text")
                .attr("x", xScale(d.Decade))
                .attr("y", yScale(d.Magnitude) + 20)
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .text("Avg Eclipse Magnitude: " + d.Magnitude.toFixed(2));
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("r", 2.5); // Hide dot on mouseout
            d3.selectAll(".hover-line").remove(); // Remove hover lines
            d3.selectAll(".hover-text").remove(); // Remove hover text
        });

    // Add labels and title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top)
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
}






   
  