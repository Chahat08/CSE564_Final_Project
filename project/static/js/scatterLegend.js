document.addEventListener('DOMContentLoaded', function () {
    // Define the color mappings for the eclipse types
    const colorMapping = {
        'P': '#ebd271',  // Partial
        'T': '#fcc203',  // Total
        'H': '#d62728',  // Hybrid
        'A': '#ff7f0e'   // Annular
    };

    // Select the div where the legend will be placed
    const legendDiv = d3.select('#scatter-legend');

    // Create a container for the legend
    const legendContainer = legendDiv.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'space-evenly')
        .style('background', '#000')
        .style('padding', '0px')
        .style('border-radius', '5px')
        .style('border', '1px solid #ccc')
        .style('margin-top', '10px');

    // Add legend items
    Object.entries(colorMapping).forEach(([type, color]) => {
        const item = legendContainer.append('div')
            .style('display', 'flex')
            .style('align-items', 'center');

        // Color box
        item.append('div')
            .style('width', '10px')
            .style('height', '10px')
            .style('background-color', color)
            .style('margin-right', '2px');

        // Text label
        item.append('text')
            .text(type)
            //.style('font-weight', 'bold')
            .style('font-size', 8);
    });
});