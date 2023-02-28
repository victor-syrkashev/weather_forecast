const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

const { openWeatherAppId, unsplashAccessKey } = process.env;

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

const listOfCity = [
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Уфа',
  'Ростов-на-Дону',
  'Омск',
  'Томск',
  'Красноярск',
  'Воронеж',
  'Пермь',
  'Волгоград',
  'Краснодар',
  'Тюмень',
  'Новосибирск',
  'Барнаул',
  'Кемерово',
  'Новокузнецк',
  'Саратов',
  'Ижевск',
  'Тольятти',
];

function requestToOpenWeatherApi(city, apiKey) {
  return axios(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`
  );
}

function requestToUnsplashApi(keyword, apiKey) {
  return axios(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
      keyword
    )}&orientation=landscape&client_id=${apiKey}`
  );
}

function sendRequests(city, res) {
  requestToOpenWeatherApi(city, openWeatherAppId)
    .then((resOpenWeather) => {
      const resWeather = resOpenWeather.data.weather[0].main.toLowerCase();
      const weather = weatherKeywords[resWeather];
      requestToUnsplashApi(weather, unsplashAccessKey)
        .then((resUnsplash) => {
          res.json({
            openWeatherResponse: resOpenWeather.data,
            unsplashResponse: resUnsplash.data,
            cityName: city,
          });
        })
        .catch((error) => {
          res.json({ unsplashResponse: error.response.data });
        });
    })
    .catch((error) => res.json({ openWeatherResponse: error.response.data }));
}

app.get('/api/search', (req, res) => {
  const city = req.query.q;
  sendRequests(city, res);
});

app.get('/api/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * listOfCity.length);
  const city = listOfCity[randomIndex];
  sendRequests(city, res);
});

app.use('/assets', express.static(path.resolve(__dirname, './client')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/404.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
