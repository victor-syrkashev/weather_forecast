import { openWeather } from './weatherApi.js';
import { searchPhoto } from './unsplashApi.js';

// Query Parameters
// accessKey=mo5bttz_Q-h7dwuQAz__mFtvLaNjcUKn8wQ6Ni_PIWY&appid=e1079f410170b27d84579337a97066eb

// Constants
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

const container = document.querySelector('.container');
const header = document.querySelector('header');
const formContainer = document.querySelector('.form-container');
const logo = document.querySelector('.logo');
const logoImg = document.querySelector('.logo img');
const form = document.querySelector('.your-city');
const cityInput = document.querySelector('#city-input');
const alertMsg = document.querySelector('.alert-msg');
const cityName = document.querySelector('.city-name');
const icon = document.querySelector('.icon');
const temperature = document.querySelector('.temperature');
const preloader = document.querySelector('.preloader');

window.addEventListener('load', () => {
  preloader.classList.add('hide-preloader');
});
logo.addEventListener('click', () => showMainPage());

// Submit form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  hideMainPage();
  cityInput.classList.remove('no-such-city');
  alertMsg.style.visibility = 'hidden';
  cityInput.setAttribute('disabled', 'disabled');
  const city = cityInput.value;

  openWeather(city)
    .then((data) => {
      if (data.cod === 200) {
        cityName.textContent = capitalize(city);
        icon.innerHTML = `<img src=" http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather-icon">`;
        temperature.textContent = showTemperature(data.main.temp);
        const keywords = weatherKeywords[data.weather[0].main.toLowerCase()];

        searchPhoto(keywords)
          .then((photo) => {
            if (photo.errors === undefined) {
              const backgroundUrl = photo.results[0].urls.regular;
              container.style.background = `url(${backgroundUrl}) center/cover no-repeat`;
              preloader.classList.add('hide-preloader');
              cityInput.removeAttribute('disabled', 'disabled');
            } else errorHandlerUnsplashApi(photo);
          })
          .catch((err) => console.error(err));
      } else errorHandlerOpenWeatherApi(data);
    })
    .catch((err) => console.log(err));
});

// functions
const showMainPage = () => {
  header.classList.add('default');
  formContainer.classList.remove('hide');
  form.style.alignSelf = 'flex-start';
  logoImg.style.transform = 'scale(1)';
  cityInput.value = '';
  cityInput.classList.remove('no-such-city');
  alertMsg.style.visibility = 'hidden';
};

const hideMainPage = () => {
  formContainer.classList.add('hide');
  header.classList.remove('default');
  form.style.alignSelf = 'center';
  logoImg.style.transform = 'scale(0.7)';
};

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

const errorWindow = (errorMsg) => {
  preloader.classList.add('hide-preloader');
  cityInput.removeAttribute('disabled', 'disabled');
  container.style.background = 'url(./images/alert.jpg) center/cover no-repeat';
  temperature.innerHTML = errorMsg;
  cityName.textContent = '';
  icon.innerHTML = '';
};

const errorHandlerOpenWeatherApi = (data) => {
  if (data.cod === '404') {
    if (data.message === 'city not found') {
      cityInput.classList.add('no-such-city');
      alertMsg.style.visibility = 'visible';
    }
    errorWindow(`${data.message} <br/> sorry`);
  } else if (data.cod === 401) {
    errorWindow('error. invalid AppId OpenWeather');
  } else if (data.cod === '400') {
    errorWindow('error. nothing to geocode');
  }
};

const errorHandlerUnsplashApi = (data) => {
  if (data.errors[0] === 'OAuth error: The access token is invalid') {
    errorWindow('error. invalid access key unsplash');
  } else if (data.errors[0] === 'query is missing') {
    errorWindow('error. query is missing');
  } else if (data.errors[0] === 'Not found') {
    errorWindow('error. not found');
  }
};
