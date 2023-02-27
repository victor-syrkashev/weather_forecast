import { checkDataFromOpenWeatherApi } from './utilities.js';

(function tests() {
  function fullData() {
    const data = {
      main: {
        pressure: 1000,
        humidity: 66,
        temp: 24,
      },
      weather: [
        {
          icon: '01d',
          main: 'clear sky',
        },
      ],
    };
    if (checkDataFromOpenWeatherApi(data) === true) {
      console.log('PASS: fullData');
    } else {
      console.log('FAIL: fullData');
    }
  }

  function emptyData() {
    const data = {};
    if (checkDataFromOpenWeatherApi(data) === false) {
      console.log('PASS: emptyData');
    } else {
      console.log('FAIL: emptyData');
    }
  }

  function dataFalsy() {
    const data = 0;
    if (checkDataFromOpenWeatherApi(data) === false) {
      console.log('PASS: dataFalsy');
    } else {
      console.log('FAIL: dataFalsy');
    }
  }

  function weatherFalsy() {
    const data = {
      main: {
        pressure: 1000,
        humidity: 66,
        temp: 24,
      },
      weather: 0,
    };
    if (checkDataFromOpenWeatherApi(data) === false) {
      console.log('PASS: weatherFalsy');
    } else {
      console.log('FAIL: weatherFalsy');
    }
  }

  function weatherArrayFalsy() {
    const data = {
      main: {
        pressure: 1000,
        humidity: 66,
        temp: 24,
      },
      weather: [],
    };
    if (checkDataFromOpenWeatherApi(data) === false) {
      console.log('PASS: weatherArrayFalsy');
    } else {
      console.log('FAIL: weatherArrayFalsy');
    }
  }

  function mainFalsy() {
    const data = {
      main: 0,
      weather: [
        {
          icon: '01d',
          main: 'clear sky',
        },
      ],
    };
    if (checkDataFromOpenWeatherApi(data) === false) {
      console.log('PASS: mainFalsy');
    } else {
      console.log('FAIL: mainFalsy');
    }
  }

  function dataWeatherArrayIconFalsy() {
    const data = {
      main: {
        pressure: 1000,
        humidity: 66,
        temp: 24,
      },
      weather: [
        {
          icon: undefined,
          main: 'clear sky',
        },
      ],
    };
    if (checkDataFromOpenWeatherApi(data) === false) {
      console.log('PASS: dataWeatherArrayIconFalsy');
    } else {
      console.log('FAIL: dataWeatherArrayIconFalsy');
    }
  }

  function dataMainPressureFalsy() {
    const data = {
      main: {
        pressure: NaN,
        humidity: 66,
        temp: 24,
      },
      weather: [
        {
          icon: 0,
          main: 'clear sky',
        },
      ],
    };
    if (checkDataFromOpenWeatherApi(data) === false) {
      console.log('PASS: dataMainPressureFalsy');
    } else {
      console.log('FAIL: dataMainPressureFalsy');
    }
  }

  function dataMainZeroTempTrue() {
    const data = {
      main: {
        pressure: 1000,
        humidity: 66,
        temp: 0,
      },
      weather: [
        {
          icon: 0,
          main: 'clear sky',
        },
      ],
    };
    if (checkDataFromOpenWeatherApi(data) === true) {
      console.log('PASS: dataMainZeroTempTrue');
    } else {
      console.log('FAIL: dataMainZeroTempTrue');
    }
  }

  console.log('=====================');
  fullData();
  console.log('---------------------');
  emptyData();
  console.log('---------------------');
  dataFalsy();
  console.log('---------------------');
  weatherFalsy();
  console.log('---------------------');
  weatherArrayFalsy();
  console.log('---------------------');
  mainFalsy();
  console.log('---------------------');
  dataWeatherArrayIconFalsy();
  console.log('---------------------');
  dataMainPressureFalsy();
  console.log('---------------------');
  dataMainZeroTempTrue();
  console.log('=====================');
})();
