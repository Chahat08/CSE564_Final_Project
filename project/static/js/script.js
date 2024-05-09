var country = ""
var ec_type = ["Partial", "Annular", "Total", "Hybrid"]
var selected_decades = []
var selectedConstellations = ["Sagittarius", "Capricornus", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpius", "Ophiuchus"]

const colors = [
    "#6ceb6c", // green
    "#bc6ceb", // purple
    "#f55656", // red
    "#eff556" // yellow
]

document.addEventListener('DOMContentLoaded', function () {

    var resetButton = document.getElementById('resetButton');

    resetButton.addEventListener('click', function () {
        d3.json('/reset_values').then(function (data) {
            country = data.country;
            ec_type = data.ec_type;
            selected_decades = data.selected_decades;
            selectedConstellations = data.selectedConstellations;

            console.log("Variables have been reset to:", data);

            fetchandRenderChoropleth();
            fetchandRenderDonut();
            fetchandRenderScatterPlot();
            fetchandRenderRadialPlot();
            fetchandRenderTimeSeriesPlot();
            fetchandRenderMDSPlot();

        }).catch(function (error) {
            console.error('Error fetching reset values:', error);
        });
    });

    fetchandRenderChoropleth();
    fetchandRenderDonut();
    fetchandRenderScatterPlot();
    fetchandRenderRadialPlot();
    fetchandRenderTimeSeriesPlot();
    fetchandRenderMDSPlot();


});

// Function to load external JavaScript files dynamically
function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

function fetchandRenderChoropleth(){

    fetch('/receive_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'selected_decades' : selected_decades, 'selectedConstellations':selectedConstellations})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response from the Flask route
    })
    .catch(error => {
        console.error('Error:', error);
    });

    fetch('/chloropleth')
        .then(response => response.json())
        .then(data => {
            console.log("Drawing Choropleth")
            drawChloropleth(data)

        }).catch(error => console.error('Error:', error));

};

function fetchandRenderScatterPlot(){

    fetch('/receive_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'selected_decades' : selected_decades, 'selectedConstellations':selectedConstellations})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response from the Flask route
    })
    .catch(error => {
        console.error('Error:', error);
    });


    fetch('/scatter_plot')
        .then(response => response.json())
        .then(data => {
            console.log("Drawing ScatterPlot")

            drawScatterPlot(data);
        })
        .catch(error => console.error('Error:', error));
}

function fetchandRenderTimeSeriesPlot(){

    fetch('/receive_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'selected_decades' : selected_decades, 'selectedConstellations':selectedConstellations})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response from the Flask route
    })
    .catch(error => {
        console.error('Error:', error);
    });



        fetch('/timeseries')
            .then(response => response.json())
            .then(data => {
                console.log("Drawing Timeseries")

                console.log("Timeseries data: ", data);
                drawTimeseriesPlot(data);
    
            }).catch(error => console.error('Error:', error));
    
}

function fetchandRenderDonut() {
    fetch('/receive_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'selected_decades' : selected_decades, 'selectedConstellations':selectedConstellations})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response from the Flask route
    })
    .catch(error => {
        console.error('Error:', error);
    });


    fetch('/donut')
        .then(response => response.json())
        .then(data => {
                console.log("Drawing Donut")

                drawDonut(data);
        }).catch(error => console.error('Error:', error));
}


function fetchandRenderRadialPlot() {
    fetch('/receive_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'selected_decades' : selected_decades, 'selectedConstellations':selectedConstellations})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response from the Flask route
    })
    .catch(error => {
        console.error('Error:', error);
    });


    fetch('/radialChart')  // Make sure this matches the correct Flask endpoint
        .then(response => response.json())
        .then(data => {
            console.log("Drawing RadialPlot")

            drawRadialPlot(data)            
        })
        .catch(error => console.error('Error:', error));
}



function fetchandRenderMDSPlot() {
    fetch('/receive_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'selected_decades' : selected_decades, 'selectedConstellations':selectedConstellations})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response from the Flask route
    })
    .catch(error => {
        console.error('Error:', error);
    });



    fetch('/mdsplot')
        .then(response => response.json())
        .then(data => {
            console.log("Drawing MDSPlot")

            // console.log("Timeseries data: ", data)
            renderMDSAttrPlot(data)

        }).catch(error => console.error('Error:', error));

}


