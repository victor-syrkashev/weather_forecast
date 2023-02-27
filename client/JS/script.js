import { checkDataFromOpenWeatherApi } from './utilities.js';

const weatherIcons = {
  '01d': '/assets/images/weather-icons/clear-sky-day.png',
  '01n': '/assets/images/weather-icons/clear-sky-night.png',
  '02d': '/assets/images/weather-icons/few-clouds-day.png',
  '02n': '/assets/images/weather-icons/few-clouds-night.png',
  '03d': '/assets/images/weather-icons/scattered-clouds.png',
  '03n': '/assets/images/weather-icons/scattered-clouds.png',
  '04d': '/assets/images/weather-icons/broken-clouds.png',
  '04n': '/assets/images/weather-icons/broken-clouds.png',
  '09d': '/assets/images/weather-icons/shower-rain.png',
  '09n': '/assets/images/weather-icons/shower-rain.png',
  '10d': '/assets/images/weather-icons/rain-day.png',
  '10n': '/assets/images/weather-icons/rain-day.png',
  '11d': '/assets/images/weather-icons/thunderstorm.png',
  '11n': '/assets/images/weather-icons/thunderstorm.png',
  '13d': '/assets/images/weather-icons/snow.png',
  '13n': '/assets/images/weather-icons/snow.png',
  '50d': '/assets/images/weather-icons/mist-day.png',
  '50n': '/assets/images/weather-icons/mist-night.png',
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

function capitalize(string, separator) {
  const strArray = string.split(separator);
  strArray.forEach((word, index, array) => {
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
    array[index] = capitalizedWord;
  });
  const capitalizeString = strArray.join(separator);
  return capitalizeString;
}

function convertString(str) {
  str = str.trim();

  if (str.includes('-')) {
    return capitalize(str, '-');
  }

  return capitalize(str, ' ');
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
  cityInput.removeAttribute('disabled', '');
  container.style.background =
    'url(/assets/images/alert.jpg) center/cover no-repeat';

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
  if (data.cod === '404' || data.cod === 401 || data.cod === '400') {
    if (data.message === 'city not found') {
      cityInput.classList.add('no-such-city');
      showError('Город не найден. Проверьте правильность написания');
      return;
    }
    showError();
  }
}

function errorHandlerUnsplashApi(data) {
  if (
    data.errors[0] === 'OAuth error: The access token is invalid' ||
    data.errors[0] === "Couldn't find Photo"
  ) {
    showError();
  }
}

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

      const resTemperature = data.openWeatherResponse.main.temp;
      const resPressure = data.openWeatherResponse.main.pressure;
      const resPressureMmHg = Math.round(pressureConvertFactor * resPressure);
      cityName.textContent = convertString(data.cityName);
      icon.innerHTML = `<img src=${
        weatherIcons[data.openWeatherResponse.weather[0].icon]
      } alt="weather-icon">`;
      temperature.textContent = showTemperature(resTemperature);
      pressure.innerHTML = `Давление ${resPressureMmHg}мм.рт.ст.`;
      humidity.innerHTML = `Влажность ${data.openWeatherResponse.main.humidity}%`;
      const backgroundUrl = data.unsplashResponse.urls.regular;
      container.style.background = `url(${backgroundUrl}) center/cover no-repeat`;
      preloader.classList.add('hide-preloader');
      cityInput.removeAttribute('disabled', '');
    });
}

function sendForm(e) {
  e.preventDefault();
  preloader.classList.remove('hide-preloader');
  hideMainPage();
  cityInput.classList.remove('no-such-city');
  cityInput.setAttribute('disabled', '');
  sendGetRequestToTheServer(`/api/search?q=${cityInput.value}`);
}

function getRandomCityWeather(e) {
  e.preventDefault();
  preloader.classList.remove('hide-preloader');
  hideMainPage();
  cityInput.classList.remove('no-such-city');
  cityInput.setAttribute('disabled', '');
  cityInput.value = '';
  sendGetRequestToTheServer('/api/random');
}

window.addEventListener('load', () => {
  preloader.classList.add('hide-preloader');
});

logo.addEventListener('click', showMainPage);

form.addEventListener('submit', sendForm);

randomCityBtn.addEventListener('click', getRandomCityWeather);
