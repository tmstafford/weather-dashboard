let apiKey = "d91f911bcf2c0f925fb6535547a5ddc9";

let displayWeatherEl = document.querySelector("#currentWeather");
let cityTitleEl = document.querySelector("#cityTitleName");
let currentDateEl = document.querySelector("#currentDate");
let weatherIconEl = document.querySelector("#icon");
let temperatureEl = document.querySelector("#temperature");
let humidityEl = document.querySelector("#humidity");
let windSpeedEl = document.querySelector("#windSpeed");
let UVIndexEl = document.querySelector("#uvIndex");

let todayDate = moment().format('MM/DD/YYYY');

let getCurrentWeather = function(cityName) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl)
    .then(function(response) {
        response.json().then(function(data) {
            console.log(response);
            console.log(apiUrl);
            console.log(data.main.temp);
            
            displayWeatherEl.classList = "currentWeather";
            cityTitleEl.textContent = cityName;
            currentDateEl.textContent = "(" + todayDate + ")";

            let getIcon = data.weather[0].icon;
            console.log(getIcon);
            let iconUrl = "http://openweathermap.org/img/wn/" + getIcon + ".png";
            weatherIconEl.setAttribute("src", iconUrl);

            let currentTemp = data.main.temp;
            temperatureEl.textContent = "Temperature: " + currentTemp + " °F";
            let currentHumidity = data.main.humidity;
            humidityEl.textContent = "Humidity: " + currentHumidity + " %"; 
            let currentWind = data.wind.speed;
            windSpeedEl.textContent = "Wind Speed: " + currentWind + " MPH";

            let latitude = data.coord.lat;
            let longitude = data.coord.lon;
            let uvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
            fetch(uvUrl).then(function(response) {
                response.json().then(function(data) {
                    console.log(data.value);
                    let currentUV = data.value;
                    UVIndexEl.textContent = "UV Index: " + currentUV;
                });
            });
        });
    });
};


let searchCityEl = document.querySelector("#cityInput");
let submitBtnEl = document.querySelector("#submitCity");

let formSubmitHandler = function(event) {
    event.preventDefault();
    let city = searchCityEl.value.trim();
    if (city) {
        getCurrentWeather(city);
        searchCityEl.value = "";
    }
}

// getCurrentWeather();
submitBtnEl.addEventListener("click", formSubmitHandler);