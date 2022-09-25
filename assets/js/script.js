var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#cityname');
var currentCityWeatherEl = document.querySelector("#current-city-weather");
var fiveDayForecastEl = document.querySelector("#five-day-forecast-weather");
var subtitleEl = document.querySelector("#subtitle");
var citiesEl = document.querySelector("#searched-cities");

var cities = [];

function init(){
    // Get stored cities from localStorage
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCities !== null) {
        cities = storedCities;
    }

     // Display each city as a button 
    renderSearchHistory();
    
}

function formSubmitHandler(event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName){
        // Display current weather and five day forecast weather data for the city
        getCitysWeatherInfo(cityName);

        cityInputEl.value = "";
        currentCityWeatherEl.innerHTML = "";
        fiveDayForecastEl.innerHTML = "";
        subtitleEl.innerHTML = '';

    } else {
        alert("Please enter a city name");
    }
}


function buttonClickHandler(event) {
    var element = event.target;

  // Checks if element is a button
  if (element.matches("button") === true) {
    // Get its data-index value and remove the todo element from the list
    var city = element.getAttribute("data-city");
    
    // Display current weather and five day forecast weather data for the city
    getCitysWeatherInfo(city);

    cityInputEl.value = "";
    currentCityWeatherEl.innerHTML = "";
    fiveDayForecastEl.innerHTML = "";
    subtitleEl.innerHTML = '';
    
  }
}


function storeCities() {
    // Stringify and set key in localStorage to cities array
    localStorage.setItem("cities", JSON.stringify(cities));
  }


function renderSearchHistory(){
    citiesEl.innerHTML = "";

    for (var i = 0; i < cities.length; i++){
        var btnEl = document.createElement("button");
        btnEl.classList.add("btn");
        btnEl.innerHTML = cities[i];
        btnEl.setAttribute("data-city", cities[i]);
        btnEl.setAttribute("type", "button");
        citiesEl.appendChild(btnEl);
    }
}

function getCitysWeatherInfo(city) {
    
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=e82d07c38f8006d0d8ccd5d9f7f67108";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data){
                    // Check to make sure the city entered is a a valid city 
                    if (data.length > 0) {
                        // Check if the city is in the array before add it.
                        if (!cities.includes(city)) {
                            cities.push(city);
                        }
                        // store cities into the local storage
                        storeCities();
        
                        // Display each city as a button 
                        renderSearchHistory();

                        getCurrentWeatherData(data[0].lat, data[0].lon);
                        getFiveDayForecast(data[0].lat, data[0].lon);

                    } else {
                        alert("City " + city +  " does not exist in the US. Please enter another city.");
                    }  
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error){
            alert('Unable to connect to openweathermap api');
        } );

}

function getCurrentWeatherData(lat,lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=e82d07c38f8006d0d8ccd5d9f7f67108&units=imperial";
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data){
                    displayCurrentWeather(data.name, data.dt, data.main.temp, data.main.humidity, data.wind.speed, data.weather[0].icon);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error){
            alert('Unable to connect to opeweathermap api');
        } );
}


function getFiveDayForecast(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=e82d07c38f8006d0d8ccd5d9f7f67108&units=imperial";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data){
                    displayFiveDayForecast(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error){
            alert('Unable to connect to opeweathermap api');
        } );

}

function displayCurrentWeather(cityName, currentDate, temp, humidity, windSpeed, iconcode) {
    var date =  moment.unix(currentDate).format("MM/DD/YYYY");
    var iconUrl = "https://openweathermap.org/img/w/" + iconcode + ".png";

    var cityEl = document.createElement("h3");
    cityEl.innerHTML = cityName + " " + "(" + date + ") ";
    var spanEl = document.createElement("span");
    var iconEl = document.createElement("img");
    iconEl.src = iconUrl;
    iconEl.classList.add("weather-image");
    spanEl.appendChild(iconEl);
    cityEl.appendChild(spanEl);
    
    currentCityWeatherEl.appendChild(cityEl);

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + temp + "°F";
    currentCityWeatherEl.appendChild(tempEl);

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + windSpeed + " MPH";
    currentCityWeatherEl.appendChild(windEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";
    currentCityWeatherEl.appendChild(humidityEl);
    currentCityWeatherEl.classList.add("border");

}

function displayFiveDayForecast(info) {
   
    var titleEl = document.createElement("h4");
    titleEl.innerHTML = "5-Day Forecast:";
    subtitleEl.appendChild(titleEl);

    var currentDate = moment().format("YYYYMMDD");

    //Get the next five days weather forecast
    for (var i = 0; i < info.list.length; i++){
        var nextDate = moment.unix(info.list[i].dt).format("YYYYMMDD");
        if (nextDate > currentDate){
            displayForecastData(info.list[i]);
            currentDate = nextDate;    
        } 
    }

}

function displayForecastData(weatherInfo){
    var date = moment.unix(weatherInfo.dt).format("MM/DD/YYYY");
    var iconUrl = "https://openweathermap.org/img/w/" + weatherInfo.weather[0].icon + ".png";
    var temp = weatherInfo.main.temp;
    var windSpeed = weatherInfo.wind.speed;
    var humidity = weatherInfo.main.humidity;

    var divEl = document.createElement("div");

    var dateEl = document.createElement("p");
    dateEl.innerHTML = date;
    divEl.appendChild(dateEl);

    var iconEl = document.createElement("img");
    iconEl.src = iconUrl;
    iconEl.classList.add("weather-image");
    divEl.appendChild(iconEl);

    var tempEl = document.createElement("p");
    tempEl.textContent = "Temp: " + temp + "°F";
    divEl.appendChild(tempEl);

    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + windSpeed + " MPH";
    divEl.appendChild(windEl);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + humidity + "%";
    divEl.appendChild(humidityEl);
    divEl.classList.add("five-day-forecast");

    fiveDayForecastEl.appendChild(divEl)
   
}


 cityFormEl.addEventListener('submit', formSubmitHandler);

 citiesEl.addEventListener("click", buttonClickHandler);
 
 // Calls init to retrieve data and render it to the page on load
 init();

