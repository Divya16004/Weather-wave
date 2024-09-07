const express = require('express');
const router = express.Router();
const axios = require('axios');

// Replace with your OpenWeatherMap API key
const API_KEY = 'a8309864ebc557e9c1846ef22a29ad10';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';

router.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.render('hourly', { hourlyForecast: null, error: 'City is required' });
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });
    // Filter response for the next 24 hours (8 * 3-hour intervals)
    const hourlyForecast = response.data.list.slice(0, 8);
    res.render('hourly', { hourlyForecast, error: null });
  } catch (error) {
    res.render('hourly', { hourlyForecast: null, error: 'Failed to fetch hourly forecast data' });
  }
});

module.exports = router;
