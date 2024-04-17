document.addEventListener('DOMContentLoaded', function () {
    const margin = { top: 7, right: 15, bottom: 33, left: 50 };

    fetch('/hexbin_plot')
        .then(response => response.json())
        .then(data => {
            console.log(data)
        }).catch(error => console.error('Error:', error));

});