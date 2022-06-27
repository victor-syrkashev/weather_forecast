// Constants
const weatherIcons = {
  '01d': '../public/images/weather-icons/clear-sky-day.png',
  '01n': '../public/images/weather-icons/clear-sky-night.png',
  '02d': '../public/images/weather-icons/few-clouds-day.png',
  '02n': '../public/images/weather-icons/few-clouds-night.png',
  '03d': '../public/images/weather-icons/scattered-clouds.png',
  '03n': '../public/images/weather-icons/scattered-clouds.png',
  '04d': '../public/images/weather-icons/broken-clouds.png',
  '04n': '../public/images/weather-icons/broken-clouds.png',
  '09d': '../public/images/weather-icons/shower-rain.png',
  '09n': '../public/images/weather-icons/shower-rain.png',
  '10d': '../public/images/weather-icons/rain-day.png',
  '10n': '../public/images/weather-icons/rain-day.png',
  '11d': '../public/images/weather-icons/thunderstorm.png',
  '11n': '../public/images/weather-icons/thunderstorm.png',
  '13d': '../public/images/weather-icons/snow.png',
  '13n': '../public/images/weather-icons/snow.png',
  '50d': '../public/images/weather-icons/mist-day.png',
  '50n': '../public/images/weather-icons/mist-night.png',
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

window.addEventListener('load', () => {
  preloader.classList.add('hide-preloader');
});
logo.addEventListener('click', () => {
  showMainPage();
});

// Submit form
form.addEventListener('submit', (e) => {
  e.preventDefault();

  preloader.classList.remove('hide-preloader');
  hideMainPage();
  cityInput.classList.remove('no-such-city');
  cityInput.setAttribute('disabled', 'disabled');

  sendGetRequestToTheServer(`/index.html/search?q=${cityInput.value}`);
});

// Click random-city-button

randomCityBtn.addEventListener('click', (e) => {
  e.preventDefault();

  preloader.classList.remove('hide-preloader');
  hideMainPage();
  cityInput.classList.remove('no-such-city');
  cityInput.setAttribute('disabled', 'disabled');
  cityInput.value = '';

  sendGetRequestToTheServer('/index.html/random');
});

// functions
function sendGetRequestToTheServer(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.photo && data.photo.errors !== undefined) {
        errorHandlerUnsplashApi(data.photo);
        return;
      }
      if (data.openWeather.cod !== 200) {
        errorHandlerOpenWeatherApi(data.openWeather);
        return;
      }
      if (!checkDataFromOpenWeatherApi(data.openWeather)) {
        errorWindow();
        console.log('Нет необходимой информации о погоде в ответе c сервера');
        return;
      }
      cityName.textContent = capitalize(data.cityName);
      icon.innerHTML = `<img src=${weatherIcons[data.openWeather.weather[0].icon]} alt="weather-icon">`;
      temperature.textContent = showTemperature(data.openWeather.main.temp);
      pressure.innerHTML = `Давление ${Math.round(0.75008 * data.openWeather.main.pressure)}мм.рт.ст.`;
      humidity.innerHTML = `Влажность ${data.openWeather.main.humidity}%`;
      const backgroundUrl = data.photo.results[0].urls.regular;
      container.style.background = `url(${backgroundUrl}) center/cover no-repeat`;
      preloader.classList.add('hide-preloader');
      cityInput.removeAttribute('disabled', 'disabled');
    })
    .catch((err) => console.log(err));
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

function checkData(data) {
  if (!data || data === NaN || data === undefined) {
    return false;
  }
}

function checkDataFromOpenWeatherApi(data) {
  const array = [data.weather[0].icon, data.main.temp, data.main.pressure, data.main.humidity, data.weather[0].main];
  for (let i = 0; i < array.length; i++) {
    if (checkData(array[i]) === false) {
      return false;
    }
  }
  return true;
}

function errorWindow(errorMsg) {
  preloader.classList.add('hide-preloader');
  cityInput.removeAttribute('disabled', 'disabled');
  container.style.background = 'url(./public/images/alert.jpg) center/cover no-repeat';

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
      errorWindow('Город не найден. Проверьте правильность написания');
      return console.log('city not found');
    }
    errorWindow();
  } else if (data.cod === 401) {
    errorWindow();
    console.log('error. invalid AppId OpenWeather');
  } else if (data.cod === '400') {
    errorWindow();
    console.log('error. nothing to geocode');
  }
}

function errorHandlerUnsplashApi(data) {
  if (data.errors[0] === 'OAuth error: The access token is invalid') {
    errorWindow();
    console.log('error. invalid access key unsplash');
  } else if (data.errors[0] === 'query is missing') {
    errorWindow();
    console.log('error. query is missing');
  } else if (data.errors[0] === 'Not found') {
    errorWindow();
    console.log('error. not found');
  }
}
