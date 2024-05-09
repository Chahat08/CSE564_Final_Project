


function renderMDSAttrPlot(mdsdata){
    // console.log("Rendering MDS Data Plot with K = ", selected_k)

    data = mdsdata.mds_attr

    var svgWidth = 560;
    var svgHeight = 340;
    var margin = { top: 50, right:50, bottom: 50, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    d3.select("#MDSplot").selectAll("*").remove();

    var svg = d3.select("#MDSplot")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var domainPadding = 0.5; // Padding value

    // Calculate the extent of Comp1
    var comp1Extent = d3.extent(data, d => d.Comp1);

    // Add padding to the extent
    var paddedExtent = [comp1Extent[0], comp1Extent[1] + domainPadding];

    // Set scales for x and y axes
    var xScale = d3.scaleLinear()
        .domain(paddedExtent) // Assuming Comp1 is the first MDS component
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Comp2)) // Assuming Comp2 is the second MDS component
        .range([height, 0]);


    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(xScale).tickSizeOuter(0))
        .style("color", "white")
        .selectAll("text")
        // .style("font-size", "14px");

    svg.append('g')
        .call(d3.axisLeft(yScale).tickSizeOuter(0))
        .style("color", "white")
        .selectAll("text")
        // .style("font-size", "14px");

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top -10) + ")")
        .style("text-anchor", "middle")
        // .style("font-size", "16px")
        .style("fill", "white")
        // .style("font-weight", "bold")
        .text("Component 1");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left )
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        // .style("font-size", "16px")
        .style("fill", "white")
        // .style("font-weight", "bold")
        .text("Component 2");

    var selectedAttributes = [];
    var linesGroup = svg.append("g");

    svg.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.Comp1) + 7 ) // Adjust x position for label
        .attr("y", d => yScale(d.Comp2)) // Adjust y position for label
        .text(d => d.feature)
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "white");

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Comp1))
        .attr("cy", d => yScale(d.Comp2))
        .attr("r", 5)
        .style("fill", "steelblue")

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "white")
        .text("MDS Attribute Similarity");
} 