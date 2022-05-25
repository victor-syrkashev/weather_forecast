const accessKey = 'mo5bttz_Q-h7dwuQAz__mFtvLaNjcUKn8wQ6Ni_PIWY';

const searchPhoto = (weather) => fetch(`https://api.unsplash.com/search/photos?query=${weather}&page=1&per_page=1&orientation=landscape&client_id=${accessKey}`)
  .then((response) => response.json())
  .catch((err) => console.error(err));

export default searchPhoto;
