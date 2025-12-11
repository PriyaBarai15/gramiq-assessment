import React from 'react';

export default function WeatherCard({ current, location }) {
  const windKmh = (current.wind_speed || 0) * 3.6;
  return (
    <div className="weather-card">
      <h2>{location.name}{location.state ? ', '+location.state : ''} — {location.country}</h2>
      <div className="metrics">
        <div>Temp: {current.temp} °C</div>
        <div>Humidity: {current.humidity} %</div>
        <div>Wind: {Math.round(windKmh)} km/h</div>
        <div>Condition: {current.weather.description || current.weather.main}</div>
      </div>
    </div>
  );
}
