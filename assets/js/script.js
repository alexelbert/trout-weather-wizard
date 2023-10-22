let cityInput = document.getElementById('city-input');
let searchButton = document.querySelector('.search-btn');
let currentWeatherDiv = document.querySelector('.weatherdetails');

function weatherCard(weatherData, name) {
    let currentWeather = `<div class="weatherdetails">
                    <h2>Weather in ${name} right now</h2>
                    <h4>Cloud cover: ${weatherData.current.cloudcover} %</h4>
                    <h4>Temperature: ${weatherData.current.temperature_2m} °C</h4>
                    <h4>Wind: ${weatherData.current.windspeed_10m} km/h</h4>
                    <h4>Wind direction: ${weatherData.current.winddirection_10m} °</h4>
                    <h4>Sea pressure: ${weatherData.current.pressure_msl} hPa</h4>
                    <h4>Precipitation: ${weatherData.current.precipitation} mm</h4>
                </div>`;
    return currentWeather;
}


function updateWeatherCard(weatherData, name) {
    currentWeatherDiv.innerHTML = '';
    currentWeatherDiv.innerHTML = weatherCard(weatherData, name);
}

/**
 * Takes the values returned from geocoding API
 * and fetches the weather details from the weather API
 */
function getWeather(name, latitude, longitude, timezone) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,precipitation,cloudcover,pressure_msl,windspeed_10m,winddirection_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,winddirection_10m_dominant&timezone=${timezone}&past_days=2&forecast_days=2`;

    fetch(weatherUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then((weatherData) => {
            console.log(weatherData);
            updateWeatherCard(weatherData, name);
        })
        .catch(() => {
            alert("Can't find weather information");
        });
}

/**
 * Takes the input city and compare the response to
 * the weather API to get access to the coordinates needed
 * for the weather API
 */
function getCityCoordinates() {
    let cityName = cityInput.value.trim(); // Get user input and trim whitespace
    if (!cityName) return; // Returns nothing if cityName is empty
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;

    fetch(geocodingUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then((geocodingData) => {
            if (!geocodingData.results) return alert(`No coordinates found for ${cityName}`);
            let { name, latitude, longitude, timezone } = geocodingData.results[0];
            getWeather(name, latitude, longitude, timezone);
        })
        .catch(() => {
            alert("Can't fetch the coordinates");
        });
}

searchButton.addEventListener('click', getCityCoordinates);
