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

// fetch weather and display information on the page for desired city 
let getCurrentWeather = function(cityName) {
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            // response was successful
            response.json().then(function(data) {
            
                displayWeatherEl.classList = "currentWeather";
                cityTitleEl.textContent = cityName;
                currentDateEl.textContent = "(" + todayDate + ")";
                // get icon img from data 
                let getIcon = data.weather[0].icon;
                let iconUrl = "http://openweathermap.org/img/wn/" + getIcon + ".png";
                weatherIconEl.setAttribute("src", iconUrl);
                weatherIconEl.setAttribute("alt", data.weather[0].description);

                let currentTemp = data.main.temp;
                temperatureEl.textContent = "Temperature: " + currentTemp + " °F";
                let currentHumidity = data.main.humidity;
                humidityEl.textContent = "Humidity: " + currentHumidity + " %"; 
                let currentWind = data.wind.speed;
                windSpeedEl.textContent = "Wind Speed: " + currentWind + " MPH";
                
                // fetch api for UV index
                let latitude = data.coord.lat;
                let longitude = data.coord.lon;
                let uvUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
                fetch(uvUrl).then(function(response) {
                    response.json().then(function(data) {
                        let currentUV = data.value;
                        let uvSpan = document.createElement("span");
                        uvSpan.textContent = currentUV;
                        // add color to the span based on current UV Index value 
                        if (currentUV < 3) {
                            uvSpan.classList = "low uvSpan";
                        } else if (currentUV < 6) {
                            uvSpan.classList = "moderate uvSpan";
                        } else if (currentUV < 8) {
                            uvSpan.classList = "high uvSpan";
                        } else if (currentUV < 11) {
                            uvSpan.classList = "severe uvSpan";
                        }
                        UVIndexEl.textContent = "UV Index: ";
                        UVIndexEl.appendChild(uvSpan);
                    });
                });
           });
        } else {
            // if response was not successful
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        // catch other errors 
        alert("Unable to connect to OpenWeather");
    });
};

let forecastWeatherEl = document.querySelector("#forecastWeather");
let showForecastEl = document.querySelector("#showForecast");
let forecastEl = document.querySelector("#fiveDayForecast");

// fetch 5 day forecast and display on page for same desired city 
let getForecast = function(cityName) {
    let forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    fetch(forecastUrl)
    .then(function(response) {
        if (response.ok) {
            // if response was successful 
            response.json().then(function(data) {
                showForecastEl.innerHTML = "";
                forecastEl.innerHTML = "";

                let showForecast = document.createElement("h2");
                showForecast.textContent = "5-Day Forecast:";
                showForecastEl.appendChild(showForecast);
                
                // create each day of the forecast and display in a row
                for (i=0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        console.log(data.list[i]);

                        let cardDiv = document.createElement("div");
                        cardDiv.classList = "card bg-primary col-md-2 col-sm-12";
                        forecastEl.appendChild(cardDiv);
                        let cardBody = document.createElement("div");
                        cardBody.setAttribute("id", "cardBody");
                        cardBody.classList = "card-body";
                        cardDiv.appendChild(cardBody);
                        // convert date to (MM/DD/YYYY)
                        let date = new Date(data.list[i].dt*1000);
                        let month = date.getMonth()+ 1;
                        let day = date.getDate();
                        if (day < 10) {
                            day = "0" + date.getDate();
                        }
                        let year = date.getFullYear();

                        let forecastDate = document.createElement("h5");
                        forecastDate.classList = "card-title";
                        forecastDate.textContent = month + "/" + day + "/" + year;
                        cardBody.appendChild(forecastDate);
                        // get icon from data 
                        let getForecastIcon = data.list[i].weather[0].icon;
                        let getForecastUrl = "http://openweathermap.org/img/wn/" + getForecastIcon + ".png";
                        let forecastIcon = document.createElement("img");
                        forecastIcon.setAttribute("src", getForecastUrl);
                        forecastIcon.setAttribute("alt", data.list[i].weather[0].description);
                        cardBody.appendChild(forecastIcon);

                        let forecastTemp = document.createElement("p");
                        forecastTemp.classList = "card-text";
                        forecastTemp.textContent = "Temp: " + data.list[i].main.temp + " °F";
                        cardBody.appendChild(forecastTemp);

                        let forecastHumidity = document.createElement("p");
                        forecastHumidity.classList = "card-text";
                        forecastHumidity.textContent = "Humidity: " + data.list[i].main.humidity + " %";
                        cardBody.appendChild(forecastHumidity);
                    }
                };
            });
        } else {
            // if response not successful, alert what went wrong
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        // catch function for other errors
        alert("Unable to connect to OpenWeather");
    });
};

let searchCityEl = document.querySelector("#cityInput");
let submitBtnEl = document.querySelector("#submitCity");
let previousSearchEl = document.querySelector("#previousCity");
let cityHistory = JSON.parse(localStorage.getItem("previousSearch")) || [];

// storing city input and running other functions to display weather 
let formSubmitHandler = function(event) {
    event.preventDefault();
    let city = searchCityEl.value.trim();
    if (!cityHistory.includes(city)) {
        cityHistory.push(city);
        localStorage.setItem("previousSearch", JSON.stringify(cityHistory));
        console.log(cityHistory);
    } 
    if (cityHistory.indexOf(city) != -1) {
        cityHistory.splice(cityHistory.indexOf(city), 1)
    }
    // order list of cities based on recent search
    cityHistory.unshift(city);
    // run functions if a city is entered 
    if (city) {
        getCurrentWeather(city);
        getForecast(city);
        displaySearchHistory(cityHistory);
        searchCityEl.value = "";
    } else if (city === "") {
        // alert to enter a city if left blank
        alert("Please enter a city name!");
    }
};

// function for getting previous searches and displaying as buttons 
let displaySearchHistory = function() {
    previousSearchEl.textContent = "";
    // create button under form showing recent searches from LS
    for (let i = 0; i < cityHistory.length; i++) {
        if (cityHistory[i] != "") {
            let cityBtnEl = document.createElement("button");
            cityBtnEl.setAttribute("type", "button");
            cityBtnEl.classList = "btn btn-outline-secondary btn-block";
            cityBtnEl.setAttribute("value", cityHistory[i]);
            cityBtnEl.textContent = cityHistory[i];
            previousSearchEl.appendChild(cityBtnEl);
        }
    }
};

// clicking on a recent search button displays that cities data
let cityButtonHandler = function(event) {
    let cityClick = event.target.value;
    getCurrentWeather(cityClick);
    getForecast(cityClick);
};

let clearButtonEl = document.querySelector("#clear");
// function to clear LS and buttons of all city search history 
let clearSearchHistory = function(event) {
    event.preventDefault();
    cityHistory = [];
    localStorage.setItem("previousSearch", JSON.stringify(cityHistory));
    displaySearchHistory();
};

// render previous searches on the page when page loads
displaySearchHistory();
// event listeners for input button, previous search buttons, and clear LS button
submitBtnEl.addEventListener("click", formSubmitHandler);
previousSearchEl.addEventListener("click", cityButtonHandler);
clearButtonEl.addEventListener("click", clearSearchHistory);
