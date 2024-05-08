document.addEventListener('DOMContentLoaded', function () {

    fetch('/chloropleth')
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            drawChloropleth(data)

        }).catch(error => console.error('Error:', error));

});

function drawChloropleth(geodata) {
    // Set up the dimensions of the SVG container
    const width = 700;
    const height = 300;
    var selected = false;

    d3.select('#chloroplethPlot').selectAll('*').remove();

    // Create an SVG element
    const svg = d3.select("#chloroplethPlot").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "black");

    // Set up a projection to convert latitude and longitude to x and y coordinates
    const projection = d3.geoMercator()
        .scale(100)
        .translate([width / 2, height / 1.5]);

    // const projection = d3.geoEquirectangular();

    // Create a path generator
    const path = d3.geoPath().projection(projection);
    
    // Create a tooltip
    const tooltip = d3.select("#chloroplethPlot").append("div")
        .attr("class", "tooltipChloropleth")
        .style("position", "absolute")
        .style("visibility", "hidden");

    function highlight(obj){
        d3.select(obj)
        .style("stroke","white")
        .style("stroke-width",1.5);
    }
    function unhighlight(obj){
        d3.select(obj)
        .style("stroke","grey")
        .style("stroke-width",0.5);       
    }
    function unhighlightAll() {
        selected = "";
        svg.selectAll("path").each(function(d) {
            d.selected = false;
            unhighlight(this); // Unhighlight the country
        });
    }

    // Create a zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 3]) // Set the scale extent
        .translateExtent([[-100, -200], [width + 100, height + 200]]) // Set the translation extent
        .on("zoom", zoomed); // Specify the function to call when zooming

    // Call the zoom behavior on the SVG element
    svg.call(zoom);

    // Define the zoomed function
    function zoomed(event) {
        // Get the current transform
        const { transform } = event;
        // Apply the transform to the SVG elements
        svg.selectAll("path")
            .attr("transform", transform);
    }




    // Load the GeoJSON file
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (world) {


        // Merge GeoJSON features with the geodata JSON object
        world.features.forEach(function (feature) {
            const countryCode = feature.id;
            // console.log("Country code : " , countryCode)
            var filteredData = geodata.filter(function(d) {
                return d.Alpha3 === countryCode;
            });
            if (filteredData) {
                // console.log("Num of eclipses = ", filteredData.length)
                feature.properties.eclipses = filteredData.length;
            } else {
                feature.properties.eclipses = 0; // Default value if no data found
            }
        });

        // Create a color scale
        console.log("Max num of eclipses: ", d3.max(world.features, d => d.properties.eclipses))

        const colorScale = d3.scaleSequential()
            .domain([0, d3.max(world.features, d => d.properties.eclipses)])
            .interpolator(d3.interpolateRgb("#fcc203", "#d62728"));


        // Draw the map
        svg.selectAll("path")
            .data(world.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", d => colorScale(d.properties.eclipses))
            .attr("stroke", "grey")
            .attr("stroke-width", 0.5)
            .on("click", function(event, d){
                if( !d.selected) {
                    unhighlightAll();
                    selected = d.id;
                    console.log("Click");
                    console.log(d);
                    d.selected = true;
                    highlight(this)

                    //WRITE CODE : UPDATE GRAPHS HERE
                }
                else{
                    unhighlightAll();
                }
            })
            .on("mouseover", function(event, d) {
                tooltip.style("visibility", "visible")
                    .html("<strong>Country:</strong> " + d.properties.name + "<br><strong>Eclipses:</strong> " + d.properties.eclipses)
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
                highlight(this)
            })
            .on("mouseout", function(event, d) {
                if(d.id != selected){
                console.log("Mouseout")
                console.log(d)
                tooltip.style("visibility", "hidden");
                unhighlight(this)
                }
            });

            
        // Add a legend for the colorscale
        const legendWidth = 150;
        const legendHeight = 20;
        const legendRectWidth = 25;
        const legendRectSpacing = (legendWidth - legendRectWidth * 6) / 5;

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (20) + "," + (height - 30) + ")");

        legend.selectAll("rect")
            .data(d3.range(0, d3.max(world.features, d => d.properties.eclipses), Math.ceil(d3.max(world.features, d => d.properties.eclipses) / 6)))
            .enter().append("rect")
            .attr("x", (d, i) => i * (legendRectWidth + legendRectSpacing))
            .attr("y", 0)
            .attr("width", legendRectWidth)
            .attr("height", legendHeight)
            .style("fill", d => colorScale(d));

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", -5)
            .attr("y", legendHeight / 2)
            .attr("dy", "0.35em")
            .style("fill", "white")
            .style("font-size", "12px")
            .style("text-anchor", "end")
            .text("0");

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", legendWidth + 5)
            .attr("y", legendHeight / 2)
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("fill", "white")
            .text(d3.max(world.features, d => d.properties.eclipses));

        legend.append("text")
            .attr("class", "legend-title")
            .attr("x", legendWidth / 2)
            .attr("y", -10)
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .text("Eclipse Frequency");

            
                    
            });
        }