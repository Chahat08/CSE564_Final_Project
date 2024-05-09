function drawChloropleth(geodata) {
    // Set up the dimensions of the SVG container
    const width = 800;
    const height = 320;
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
        .attr("class", "tooltipclassic")
        .style("position", "absolute")
        .style("visibility", "hidden");

    const tooltip2 = d3.select("#chloroplethPlot").append("div")
        .attr("class", "tooltipclassic")
        .style("position", "absolute")
        .style("visibility", "hidden");

    function highlight(obj){
        d3.select(obj)
        .style("stroke","white")
        .style("stroke-width",2.5);
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
            .interpolator(d3.interpolateRgb(colors[3], colors[2]));


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
                    // console.log("Click");
                    // console.log(d);
                    d.selected = true;
                    highlight(this)

                    // console.log(d)
                    //UPDATE COUNTRY
                    country = d.id;

                    // WRITE CODE : UPDATE GRAPHS HERE
                    fetchandRenderScatterPlot();
                    // fetchandRenderMDSPlot();
                    fetchandRenderDonut();
                    fetchandRenderRadialPlot();
                    fetchandRenderTimeSeriesPlot();
                }
                else{
                    country = null;
                    unhighlightAll();

                    fetchandRenderScatterPlot();
                    // fetchandRenderMDSPlot();
                    fetchandRenderDonut();
                    fetchandRenderRadialPlot();
                    fetchandRenderTimeSeriesPlot();
                }
            })

            .on("mouseover", function(event, d) {
                const tooltipWidth = 150; // Adjust based on your tooltip content and style
                const tooltipHeight = 50; // Adjust based on your tooltip content and style
                const mouseX = event.pageX;
                const mouseY = event.pageY;
                const mapContainer = document.getElementById("chloroplethPlot");
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
                    tooltipY = mapHeight - tooltipHeight - 10; // Adjusting position to stay within the map
                }
            
                tooltip.style("visibility", "visible")
                    .html("<strong>Country:</strong> " + d.properties.name + "<br><strong>Eclipses:</strong> " + d.properties.eclipses)
                    .style("top", tooltipY + "px")
                    .style("left", tooltipX + "px");
            
                highlight(this);
            })
            
            .on("mouseout", function(event, d) {
                if(d.id != selected){
                // console.log("Mouseout")
                // console.log(d)
                tooltip.style("visibility", "hidden");
                unhighlight(this)
                }
            });

    
        //const visible_cities = other
        const visible_cities = geodata.filter(row => row.Visibility !== "Not Visible");

        const points = svg.selectAll(".point")
        .data(visible_cities) // Assuming visible_cities contains the data for the points
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 1.5)
        .attr("opacity", 1) // Adjust the radius of the circles as needed
        .attr("fill", "white")
        .attr("cx", d => projection([d["Eclipse Longitude"], d["Eclipse Latitude"]])[0])
        .attr("cy", d => projection([d["Eclipse Longitude"], d["Eclipse Latitude"]])[1])
        .on("mouseover", function(event, d) {
            const tooltipWidth = 150; // Adjust based on your tooltip content and style
            const tooltipHeight = 100; // Adjust based on your tooltip content and style
            const mouseX = event.pageX;
            const mouseY = event.pageY;
            const mapContainer = document.getElementById("chloroplethPlot");
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
                tooltipY = mapHeight - tooltipHeight - 10; // Adjusting position to stay within the map
            }

            yeartxt = d.Year.startsWith("-") ? d.Year.substring(1) + " BC" : d.Year;
        
            tooltip2.style("visibility", "visible")
                .html(d.Visibility + "<br>Year : " + yeartxt + "<br>" + d["Daytime/Nighttime"] + "<br>Duration : " + d["Central Duration"])
                .style("top", tooltipY + "px")
                .style("left", tooltipX + "px");
        
            highlight(this);
        })
        
        .on("mouseout", function(event, d) {
            if(d.id != selected){
            // console.log("Mouseout")
            // console.log(d)
            tooltip2.style("visibility", "hidden");
            d3.select(this)
            .style("stroke-width",0); 
            }
        });


        // // Define the mouseover and mouseout behavior for the points
        // points.on("mouseover", function(event, d) {
        //     // Construct the tooltip2 text based on the data
        //     let tooltip2Text = "";
        //     if (d.Visibility !== "Not Visible") {
        //         tooltip2Text += "<strong>Visibility:</strong> " + d.Visibility + "<br>";
        //     }
        //     if (d.Year) {
        //         tooltip2Text += "<strong>Year:</strong> " + d.Year + "<br>";
        //     }
        //     if (d["Daytime/Nighttime"]) {
        //         tooltip2Text += "<strong>Daytime/Nighttime:</strong> " + d["Daytime/Nighttime"] + "<br>";
        //     }
        //     if (d["Central Duration"]) {
        //         tooltip2Text += "<strong>Central Duration:</strong> " + d["Central Duration"];
        //     }

        //     // Show the tooltip2 with the constructed text
        //     tooltip2.transition()
        //         .duration(200)
        //         .style("opacity", .9);
        //     tooltip2.html(tooltip2Text)
        //         .style("left", (event.pageX + 10) + "px")
        //         .style("top", (event.pageY - 28) + "px");
        // })
        // .on("mouseout", function(event, d) {
        //     // Hide the tooltip2 on mouseout
        //     tooltip2.transition()
        //         .duration(500)
        //         .style("opacity", 0);
        // });


            // Create a zoom behavior
        const zoom = d3.zoom()
        .scaleExtent([1, 3]) // Set the scale extent
        .translateExtent([[-10, -100], [width + 10, height + 200]]) // Set the translation extent
        .on("zoom", zoomed); // Specify the function to call when zooming

        // Call the zoom behavior on the SVG element
        svg.call(zoom);

        // Define the zoomed function
        function zoomed(event) {
            // Get the current transform
            const { transform } = event;

            points.attr("transform", transform);
            // Apply the transform to the SVG elements
            svg.selectAll("path")
                .attr("transform", transform);    
        }
            
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