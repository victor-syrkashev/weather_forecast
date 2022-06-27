const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Constants

const appid = process.env.APP_ID;
const accessKey = process.env.ACCESS_KEY;

const weatherKeywords = {
  thunderstorm: 'thunderstorm',
  rain: 'raining',
  drizzle: 'raining',
  snow: 'snowing',
  clear: 'clear sky',
  clouds: 'clouds sky',
  fog: 'fog',
  mist: 'mist',
  smoke: 'smog',
  haze: 'smog',
  dust: 'dusty',
  sand: 'sand storm',
  ash: 'volcano smoke',
  squall: 'windy',
  tornado: 'tornado',
};

const listOfCity = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Уфа', 'Ростов-на-Дону', 'Омск', 'Томск', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград', 'Краснодар', 'Тюмень', 'Новосибирск', 'Барнаул', 'Кемерово', 'Новокузнецк', 'Саратов', 'Ижевск', 'Тольятти'];

// functions
function requestToOpenWeatherApi(city, apiKey) {
  return axios(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
}

function requestToUnsplashApi(keyword, apiKey) {
  return axios(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&page=1&per_page=1&orientation=landscape&client_id=${apiKey}`);
}

function sendRequests(city, res) {
  requestToOpenWeatherApi(city, appid)
    .then((resOpenWeather) => {
      const weather = weatherKeywords[resOpenWeather.data.weather[0].main.toLowerCase()];
      requestToUnsplashApi(weather, accessKey)
        .then((resUnsplash) => {
          res.json({ openWeather: resOpenWeather.data, photo: resUnsplash.data, cityName: city });
        })
        .catch((error) => {
          res.json({ photo: error.response.data });
        });
    })
    .catch((error) => res.json({ openWeather: error.response.data }));
}

app.get('/index.html/search', (req, res) => {
  const city = req.query.q;
  sendRequests(city, res);
});

app.get('/index.html/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * listOfCity.length);
  const city = listOfCity[randomIndex];
  sendRequests(city, res);
});

app.use(express.static(__dirname + '/client'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.listen(port, () => {
  console.log(`App.js listening on port ${port}`);
});
