const appid = 'e1079f410170b27d84579337a97066eb';

const openWeather = (town) => fetch(`https://api.openweathermap.org/data/2.5/weather?q=${town}&units=metric&appid=${appid}`)
  .then((response) => response.json())
  .catch((err) => console.error(err));

export default openWeather;
