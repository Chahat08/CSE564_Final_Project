document.addEventListener('DOMContentLoaded', function () {

    fetch('/bar')
        .then(response => response.json())
        .then(data => {
            console.log("Bar chart data: ", data)
            drawBarChart(data)

        }).catch(error => console.error('Error:', error));

});