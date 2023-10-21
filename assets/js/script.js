let cityInput = document.getElementById('city-input')
let searchButton = document.querySelector('.search-btn')


/**
 * Takes the input city and compare the response to 
 * the weather API to get access to the coordinates needed
 * for the weather API
 */
function getCityCoordinates() {
    let cityName = cityInput.value.trim(); //Get user input and trim whitespace
    if(!cityName) return; //Returns nothing if cityName is empty
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`

    fetch(geocodingUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
    })
    .then((data) => {
        if (!data.results) return alert(`No coordinates found for ${cityName}`);
        console.log(data);
    })
    .catch(() => {
        alert("Can't fetch the coordinates");
    });

}   


searchButton.addEventListener('click', getCityCoordinates)