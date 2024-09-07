const axios = require('axios');

// Replace with your OpenWeatherMap API key
const API_KEY = 'a8309864ebc557e9c1846ef22a29ad10';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

exports.getWeather = async (req, res) => {
  const { city } = req.query;
  
  if (!city) {
    return res.render('index', { weather: null, error: 'City is required' });
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', // Use 'imperial' for Fahrenheit
      },
    });
    res.render('index', { weather: response.data, error: null });
  } catch (error) {
    res.render('index', { weather: null, error: 'Failed to fetch weather data' });
  }
};
