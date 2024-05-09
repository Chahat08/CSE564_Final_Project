var country = ""
var ec_type = ""
var brush = []
var constellation = ""

document.addEventListener('DOMContentLoaded', function() {

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
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'brush' : brush, 'constellation':constellation})
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
            drawChloropleth(data.dataA, data.dataB)

        }).catch(error => console.error('Error:', error));

};

function fetchandRenderScatterPlot(){

    fetch('/receive_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'brush' : brush, 'constellation':constellation})
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
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'brush' : brush, 'constellation':constellation})
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
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'brush' : brush, 'constellation':constellation})
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
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'brush' : brush, 'constellation':constellation})
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
        body: JSON.stringify({'country' : country, 'ec_type' : ec_type, 'brush' : brush, 'constellation':constellation})
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


