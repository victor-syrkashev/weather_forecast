import { checkDataFromOpenWeatherApi } from './utilities.js';

const weatherIcons = {
  '01d': '/assets/public/images/weather-icons/clear-sky-day.png',
  '01n': '/assets/public/images/weather-icons/clear-sky-night.png',
  '02d': '/assets/public/images/weather-icons/few-clouds-day.png',
  '02n': '/assets/public/images/weather-icons/few-clouds-night.png',
  '03d': '/assets/public/images/weather-icons/scattered-clouds.png',
  '03n': '/assets/public/images/weather-icons/scattered-clouds.png',
  '04d': '/assets/public/images/weather-icons/broken-clouds.png',
  '04n': '/assets/public/images/weather-icons/broken-clouds.png',
  '09d': '/assets/public/images/weather-icons/shower-rain.png',
  '09n': '/assets/public/images/weather-icons/shower-rain.png',
  '10d': '/assets/public/images/weather-icons/rain-day.png',
  '10n': '/assets/public/images/weather-icons/rain-day.png',
  '11d': '/assets/public/images/weather-icons/thunderstorm.png',
  '11n': '/assets/public/images/weather-icons/thunderstorm.png',
  '13d': '/assets/public/images/weather-icons/snow.png',
  '13n': '/assets/public/images/weather-icons/snow.png',
  '50d': '/assets/public/images/weather-icons/mist-day.png',
  '50n': '/assets/public/images/weather-icons/mist-night.png',
};

const container = document.querySelector('.container');
const header = document.querySelector('header');
const formContainer = document.querySelector('.form-container');
const logo = document.querySelector('.logo');
const logoImg = document.querySelector('.logo img');
const logoText = document.querySelector('.logo h1');
const form = document.querySelector('.your-city');
const cityInput = document.querySelector('#city-input');
const cityName = document.querySelector('.city-name');
const icon = document.querySelector('.icon');
const temperature = document.querySelector('.temperature');
const pressure = document.querySelector('.pressure');
const humidity = document.querySelector('.humidity');
const preloader = document.querySelector('.preloader');
const randomCityBtn = document.querySelector('.random-city-btn');
const pressureConvertFactor = 0.75008;

window.addEventListener('load', () => {
  preloader.classList.add('hide-preloader');
});
logo.addEventListener('click', () => {
  showMainPage();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  preloader.classList.remove('hide-preloader');
  hideMainPage();
  cityInput.classList.remove('no-such-city');
  cityInput.setAttribute('disabled', 'disabled');
  sendGetRequestToTheServer(`/api/search?q=${cityInput.value}`);
});

randomCityBtn.addEventListener('click', (e) => {
  e.preventDefault();
  preloader.classList.remove('hide-preloader');
  hideMainPage();
  cityInput.classList.remove('no-such-city');
  cityInput.setAttribute('disabled', 'disabled');
  cityInput.value = '';
  sendGetRequestToTheServer('/api/random');
});

function sendGetRequestToTheServer(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.unsplashResponse && data.unsplashResponse.errors !== undefined) {
        errorHandlerUnsplashApi(data.unsplashResponse);
        return;
      }
      if (data.openWeatherResponse.cod !== 200) {
        errorHandlerOpenWeatherApi(data.openWeatherResponse);
        return;
      }
      if (!checkDataFromOpenWeatherApi(data.openWeatherResponse)) {
        showError();
        return;
      }

      cityName.textContent = capitalize(data.cityName);
      icon.innerHTML = `<img src=${weatherIcons[data.openWeatherResponse.weather[0].icon]} alt="weather-icon">`;
      temperature.textContent = showTemperature(data.openWeatherResponse.main.temp);
      pressure.innerHTML = `Давление ${Math.round(pressureConvertFactor * data.openWeatherResponse.main.pressure)}мм.рт.ст.`;
      humidity.innerHTML = `Влажность ${data.openWeatherResponse.main.humidity}%`;
      const backgroundUrl = data.unsplashResponse.urls.regular;
      container.style.background = `url(${backgroundUrl}) center/cover no-repeat`;
      preloader.classList.add('hide-preloader');
      cityInput.removeAttribute('disabled', 'disabled');
    });
}

function showMainPage() {
  header.classList.add('main-page');
  formContainer.classList.remove('hide');
  logoText.classList.remove('mini');
  form.style.alignSelf = 'flex-start';
  form.classList.remove('mini');
  logoImg.style.transform = 'scale(1)';
  cityInput.value = '';
  cityInput.classList.remove('no-such-city');
}

function hideMainPage() {
  formContainer.classList.add('hide');
  logoText.classList.add('mini');
  header.classList.remove('main-page');
  form.style.alignSelf = 'center';
  form.classList.add('mini');
  logoImg.style.transform = 'scale(0.7)';
}

function capitalize(str) {
  str = str.toLowerCase();
  const capitalizeString = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalizeString;
}

function showTemperature(temp) {
  let str = '';
  if (temp > 0) {
    str = `+${Math.round(temp)}\u00B0`;
  } else {
    str = `${Math.round(temp)}\u00B0`;
  }
  return str;
}

function showError(errorMsg) {
  preloader.classList.add('hide-preloader');
  cityInput.removeAttribute('disabled', 'disabled');
  container.style.background = 'url(/assets/public/images/alert.jpg) center/cover no-repeat';

  if (errorMsg) {
    temperature.innerHTML = errorMsg;
  } else {
    temperature.innerHTML = 'Что-то пошло не так, попробуйте еще раз позже';
  }

  cityName.textContent = '';
  icon.innerHTML = '';
  pressure.textContent = '';
  humidity.textContent = '';
}

function errorHandlerOpenWeatherApi(data) {
  if (data.cod === '404') {
    if (data.message === 'city not found') {
      cityInput.classList.add('no-such-city');
      showError('Город не найден. Проверьте правильность написания');
      return;
    }
    showError();
  } else if (data.cod === 401) {
    showError();
  } else if (data.cod === '400') {
    showError();
  }
}

function errorHandlerUnsplashApi(data) {
  if (data.errors[0] === 'OAuth error: The access token is invalid') {
    showError();
  } else if (data.errors[0] === `Couldn't find Photo`) {
    showError();
  }
}
