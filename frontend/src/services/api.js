import axios from 'axios';
const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchWeather = (location) =>
  axios.get(`${API_BASE}/weather`, { params: { location } }).then(r => r.data);
