import openWeather from './weatherApi.js';
import searchPhoto from './unsplashApi.js';

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

const cityForm = document.querySelector('.your-city');
const cityName = document.querySelector('.cityName');
const temperature = document.querySelector('.temperature');
const icon = document.querySelector('.icon');
const header = document.querySelector('header');
const chosingCityForm = document.querySelector('.chosing-city');
const logoImg = document.querySelector('.logo img');

cityForm.addEventListener('submit', (e) => {
  e.preventDefault();
  chosingCityForm.classList.add('hide');
  header.classList.remove('default');
  cityForm.style.alignSelf = 'center';
  logoImg.style.transform = 'scale(0.7)';

  const cityInput = document.querySelector('#city-input');
  const city = cityInput.value;
  cityName.textContent = capitalize(city);
  openWeather(city)
    .then((data) => {
      temperature.textContent = showTemperature(data.main.temp);
      icon.innerHTML = `<img src=" http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather-icon">`;
      const keywords = weatherKeywords[data.weather[0].main.toLowerCase()];
      searchPhoto(keywords)
        .then((photo) => {
          const container = document.querySelector('.container');
          const backgroundUrl = photo.results[0].urls.regular;
          container.style.background = `url(${backgroundUrl}) center/cover no-repeat`;
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

const capitalize = (str) => {
  str = str.toLowerCase();
  const capitalizeString = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalizeString;
};

const showTemperature = (temp) => {
  let str = '';
  if (temp > 0) {
    str = `+${Math.round(temp)}`;
  } else {
    str = Math.round(temp);
  }
  return str;
};
