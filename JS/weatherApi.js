function getQueryVariable(variable) {
  const queryVariables = {};
  window.location.search
    .substring(1)
    .split('&')
    .forEach((el) => {
      const param = el.split('=');
      queryVariables[param[0]] = param[1];
    });
  return queryVariables[variable];
}

const appid = getQueryVariable('appid');
const preloader = document.querySelector('.preloader');

const openWeather = (city) => {
  preloader.classList.remove('hide-preloader');

  return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${appid}`)
    .then((response) => response.json())
    .catch((err) => {
      console.log(err);
      console.log('Something was wrong!!!');
    });
};

export { openWeather };
