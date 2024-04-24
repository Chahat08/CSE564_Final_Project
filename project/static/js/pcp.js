document.addEventListener('DOMContentLoaded', function () {

    fetch('/pcp')
        .then(response => response.json())
        .then(data => {
            let dragging = {};
            //const width = document.querySelector('.pcpCol').offsetWidth - margin.left - margin.right;
        //const height = document.querySelector('.pcpCol').offsetHeight - margin.top - margin.bottom;
        var margin = { top: 10, right: 30, bottom: 30, left: 40 },
                width = 1000 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

        const svg = d3.select("#pcp")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Extract variables and clusters from data
        //let variables = Object.keys(data[0]).filter(key => key !== 'Cluster');
        //const clusters = [...new Set(data.map(d => d.Cluster))];

        // Define color scale
        //const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Set up scales for each variable
        let variables = ["Decade", "Gamma", "Eclipse Interval", "Eclipse Latitude", "Eclipse Longitude"];
        const y = {};
        variables.forEach(variable => {
            y[variable] = d3.scaleLinear()
                .domain(d3.extent(data, d => d[variable]))
                .range([height, 40]);
        });

        // Set up x scale for variables
        let x = d3.scalePoint()
            .domain(variables)
            .range([50, width-50]);
        //.padding(1);

        // Function to update positions
        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        // Function to reorder axes based on drag
        function transition(g) {
            return g.transition().duration(500);
        }

        // Function to update lines when axes are reordered
        function path(d) {
            return d3.line()(variables.map(function(p) {
                return [position(p), y[p](d[p])];
            }));
        }

        // Draw lines for each data point
        svg.selectAll("myPath")
            .data(data)
            .enter().append("path")
            .attr("d", d => path(d))
            .attr("class", "line")
            .style("fill", "none")
            .style("stroke", "white")
            .style("opacity", 0.5);

        // Draw axes with labels
        const axis = svg.selectAll(".axis")
            .data(variables)
            .enter().append("g")
            .attr("class", "axis")
            .attr("transform", d => "translate(" + x(d) + ")")
            .each(function(d) {
                d3.select(this).call(d3.axisLeft().scale(y[d]));
            })
            .style("cursor", "col-resize")
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        axis.append("text")
            .attr("class", "axis-label")
            .style("text-anchor", "middle")
            .attr("y", 35)
            .text(function(d) {
                return d;
            })
            .style("cursor", "col-resize")
            .style("fill", "black");

        //Add drag behavior to the axes
        axis.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        // Function implementations for drag events
        function dragstarted(event, d) {
            dragging[d] = x(d); // Store initial position of dragged axis
            svg.selectAll("path") // Dim paths while dragging
                .style("opacity", 0.2);
        }

        function dragged(event, d) {
            dragging[d] = Math.min(width, Math.max(0, event.x)); // Update position based on drag
            variables.sort(function(a, b) {
                return position(a) - position(b);
            }); // Sort variables based on drag
            x.domain(variables); // Update x scale domain
            axis.attr("transform", function(d) {
                return "translate(" + position(d) + ")";
            }); // Update axis positions
            svg.selectAll("path").attr("d", d => path(d)); // Update paths
        }

        function dragended(event, d) {
            delete dragging[d]; // Clear dragging status
            transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")"); // Animate axis back to its slot
            transition(svg.selectAll("path").data(data))
                .attr("d", d => path(d)) // Update paths
                .style("opacity", 0.5); // Restore paths opacity
        }

        // Add title to the SVG
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", margin.top + 5)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("PCP Chart");


        function reorderAxes(orderedAttributes) {
    // Start with orderedAttributes and append the rest of the variables not included in it
    const updatedOrder = orderedAttributes.concat(variables.filter(attr => !orderedAttributes.includes(attr)));

    variables = updatedOrder;
    // Update the domain of the x scale to reflect this new order
    x.domain(updatedOrder);

    // Apply transitions to reorder the axes
    svg.selectAll(".axis")
        .transition()
        .duration(500)
        .attr("transform", d => `translate(${x(d)})`);

    /*svg.selectAll("path")
                .data(data) // Ensure this is your data array
                .join(
                    enter => enter.append("path")
                                  .attr("d", d => path(d)),
                    update => update
                )
                .transition(transition) // Use the same transition as the axes for consistency
                .attr("d", d => path(d));*/

    // Apply transitions to update paths separately
    svg.selectAll(".line") // Assuming your paths have a class "line"
        .data(data) // Bind to the updated data
        .join(
            enter => enter.append("path")
                          .attr("class", "line") // Assign a class for targeting
                          .attr("d", d => path(d)) ,
            update => update
        )
        .transition() // Apply a transition to the paths
        .duration(500)
        .attr("d", d => path(d)); // Update the 'd' attribute to reflect new data
}



        window.reorderAxesGlobal = reorderAxes;
    }
            )
        .catch(error => console.error('Error:', error));
});
