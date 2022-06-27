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

const accessKey = getQueryVariable('accessKey');

const searchPhoto = (weather) => fetch(`https://api.unsplash.com/search/photos?query=${weather}&page=1&per_page=1&orientation=landscape&client_id=${accessKey}`)
  .then((response) => response.json())
  .catch((err) => console.error(err));

export { searchPhoto };
