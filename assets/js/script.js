const cityInput = document.getElementById('city-input');
const searchButton = document.querySelector('.search-btn');
const locationButton = document.querySelector('.location-btn')
const currentWeatherDiv = document.querySelector('.currentweather');
const forecastDiv = document.querySelector('.days');



/**
 * Returns the API values for current weather
 */
function weatherCard(weatherData, name) {
    const currentWeather = `<div class="weatherdetails">
                                <h2>Weather in ${name} right now</h2>
                                <h4>Cloud cover: ${weatherData.current.cloudcover}%</h4>
                                <h4>Temperature: ${weatherData.current.temperature_2m}°C</h4>
                                <h4>Wind: ${weatherData.current.windspeed_10m} km/h</h4>
                                <h4>Wind direction: ${weatherData.current.winddirection_10m}°</h4>
                                <h4>Sea pressure: ${weatherData.current.pressure_msl} hPa</h4>
                                <h4>Precipitation: ${weatherData.current.precipitation} mm</h4>
                            </div>
                            <div class="icon">
                                <img src="assets/images/390494_cloud_rain_shine_sun_weather_icon.png" alt="Weather icon">
                            </div>`;
    return currentWeather;
}

/**
 * Loops through the API daily response 
 * and assigns each weather variable to the corresponding day
 * @param {*} weatherData 
 * @returns list of past and future weather
 */

function forecast(weatherData) {
    let forecastDays = '';
    const dayTitles = ['Two days ago', 'Yesterday', 'Today', 'Tomorrow']
    for (let i = 0; i < 4; i++) {
        const oneDay = `<li class="day-info">
                            <h2>${dayTitles[i]}</h2>
                            <img src="assets/images/390494_cloud_rain_shine_sun_weather_icon.png" alt="Weather icon">
                            <h4>Temperature ${weatherData.daily.temperature_2m_min[i]}°C - ${weatherData.daily.temperature_2m_max[i]}°C</h4>
                            <h4>Wind speed: ${weatherData.daily.windspeed_10m_max[i]} km/h</h4>
                            <h4>Wind direction: ${weatherData.daily.winddirection_10m_dominant[i]}°</h4>
                            <h4>Total precipitation: ${weatherData.daily.precipitation_sum[i]} mm</h4>
                        </li>`
        forecastDays = forecastDays.concat(oneDay)
    }
    
    return forecastDays;
}

// TODO put this into weatherCard
function updateWeatherCard(weatherData, name) {
    currentWeatherDiv.innerHTML = '';
    currentWeatherDiv.innerHTML = weatherCard(weatherData, name);

    forecastDiv.innerHTML = '';
    forecastDiv.innerHTML = forecast(weatherData);
    
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
            updateWeatherCard(weatherData, name);
            forecast(weatherData);
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
    const cityName = cityInput.value.trim(); // Get user input and trim whitespace
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
            const { name, latitude, longitude, timezone } = geocodingData.results[0];
            getWeather(name, latitude, longitude, timezone);
            cityInput.value = '';
        })
        .catch(() => {
            alert("Can't fetch the coordinates");
        });
}

/**
 * Get user current location and use it as input 
 * to fetch weather data 
 * Note: No reverse geocoding in the API, used placeholder text instead
 * of city name and auto timezone
 */

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(function(userCoordinates) {
        const userLatitude = userCoordinates.coords.latitude;
        const userLongitude = userCoordinates.coords.longitude;
        getWeather('your location', userLatitude, userLongitude, 'auto')
    });
}

locationButton.addEventListener('click', function() {
    getUserCoordinates();
});

searchButton.addEventListener('click', function() {
    getCityCoordinates();
});

cityInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        getCityCoordinates();
        cityInput.value = '';
    }
})

