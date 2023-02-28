function checkDataFromOpenWeatherApi(data) {
  if (!data || Object.keys(data).length < 2) {
    return false;
  }
  if (!data.weather || !data.weather[0] || !data.main) {
    return false;
  }
  const array = [
    data.weather[0].icon,
    data.main.temp,
    data.main.pressure,
    data.main.humidity,
    data.weather[0].main,
  ];
  for (let i = 0; i < array.length; i++) {
    if (!array[i] && array[i] !== 0) {
      return false;
    }
  }
  return true;
}

export { checkDataFromOpenWeatherApi };
