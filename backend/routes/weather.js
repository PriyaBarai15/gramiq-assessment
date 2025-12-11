const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateAdvisories } = require('../utils/advisoryLogic');
const SearchHistory = require('../models/SearchHistory'); // optional

// GET /api/weather?location=Delhi
router.get('/', async (req, res) => {
  try {
    const location = req.query.location;
    if (!location) return res.status(400).json({ error: 'location is required' });

    // Use OpenWeather Geocoding to get coords
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${process.env.OPENWEATHER_KEY}`;
    const geoRes = await axios.get(geoUrl);
    if (!geoRes.data || geoRes.data.length === 0) return res.status(404).json({ error: 'Location not found' });
    const { lat, lon, name, state, country } = geoRes.data[0];

    // One Call (v3) is paid; use 5-day/3-hour forecast + current weather
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;

    const [forecastRes, currentRes] = await Promise.all([axios.get(forecastUrl), axios.get(currentUrl)]);

    // Simplify forecast: keep list of 3-hour blocks
    const forecast = forecastRes.data;
    const current = currentRes.data;

    // Derive rain probability (POP) from forecast entries if available (pop field)
    // Build a minimal payload for frontend
    const payload = {
      location: { name, state, country, lat, lon },
      current: {
        temp: current.main.temp,
        humidity: current.main.humidity,
        wind_speed: current.wind.speed, // m/s
        weather: current.weather[0]
      },
      forecast: forecast.list.map(item => ({
        dt: item.dt,
        dt_txt: item.dt_txt,
        temp: item.main.temp,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        pop: item.pop || 0,
        rain: item.rain ? item.rain['3h'] : 0
      })).slice(0, 40) // up to 5 days (40 * 3-hour entries)
    };

    // Advisory logic
    const advisories = generateAdvisories(payload.current, payload.forecast);

    // Optionally save search
    if (SearchHistory) {
      try {
        await SearchHistory.create({ locationName: `${name}${state? ', '+state: ''}, ${country}`, lat, lon, searchedAt: new Date() });
        // keep only last 5 in DB - handled in model or here
      } catch(e) {
        console.error('Failed to save search', e.message);
      }
    }

    return res.json({ ...payload, advisories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
