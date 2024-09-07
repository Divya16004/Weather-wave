const express = require('express');
const router = express.Router();
const axios = require('axios');

// Replace with your OpenWeatherMap API key
const API_KEY = 'a8309864ebc557e9c1846ef22a29ad10';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/forecast';

router.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.render('weekly', { weeklyForecast: null, error: 'City is required' });
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });
    // Filter response to get daily data (selecting every 8th item for daily forecast)
    const weeklyForecast = response.data.list.filter((_, index) => index % 8 === 0);
    res.render('weekly', { weeklyForecast, error: null });
  } catch (error) {
    res.render('weekly', { weeklyForecast: null, error: 'Failed to fetch weekly forecast data' });
  }
});

app.get('/error', (req, res) => {
  const errorMessage = req.query.message || 'An unexpected error occurred.';
  res.render('error', { errorMessage });
});

module.exports = router;
