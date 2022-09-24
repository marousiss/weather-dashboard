var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#cityname');
var currentCityWeatherEl = document.querySelector("#current-city-weather");
var fiveDayForecastEl = document.querySelector("#five-day-forecast-weather");
var subtitleEl = document.querySelector("#subtitle");



function formSubmitHandler(event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName){
        getCityLatitudeandLongitide(cityName);
        cityInputEl.value = "";
        currentCityWeatherEl.innerHTML = "";

    } else {
        alert("Please enter a city name");
    }

}

function getCityLatitudeandLongitide(city) {
    
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US&limit=1&appid=e82d07c38f8006d0d8ccd5d9f7f67108";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function(data){
                    console.log(data);
                     getCurrentWeatherData(data[0].lat, data[0].lon);
                     getFiveDayForecast(data[0].lat, data[0].lon);

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
                console.log(response);
                response.json().then(function(data){
                    console.log(data);
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
                console.log(response);
                response.json().then(function(data){
                    console.log(data);
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
    var iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";



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

function displayFiveDayForecast(data) {
    var info = data;
    var titleEl = document.createElement("h4");
    titleEl.innerHTML = "5-Day Forecast:";
    subtitleEl.appendChild(titleEl);

}










 cityFormEl.addEventListener('submit', formSubmitHandler);
 

 /**
  *  var iconcode = a.weather[0].icon;
  * var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  *  $('#wicon').attr('src', iconurl);
  * "http://openweathermap.org/img/w/04n.png"
  * 
  */
 /**
  * http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
  * http://api.openweathermap.org/geo/1.0/direct?q=Chicago,US&limit=1&appid=e82d07c38f8006d0d8ccd5d9f7f67108
  */