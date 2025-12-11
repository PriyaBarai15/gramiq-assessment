// Rule-based advisories
// Input: current {temp, humidity, wind_speed}, forecast: array of {dt, temp, pop, wind_speed}
function msToKmh(ms) { return ms * 3.6; }

function willRainInNextHours(forecast, hours=6) {
  const now = Date.now()/1000;
  const cutoff = now + hours*3600;
  return forecast.some(item => item.dt <= cutoff && (item.pop || 0) > 0.6);
}

function next6hMaxPop(forecast) {
  const now = Date.now()/1000;
  const cutoff = now + 6*3600;
  const entries = forecast.filter(f => f.dt <= cutoff);
  return entries.length ? Math.max(...entries.map(e => e.pop || 0)) : 0;
}

function generateAdvisories(current, forecast) {
  const adv = [];
  const temp = current.temp;
  const humidity = current.humidity;
  const windKmh = msToKmh(current.wind_speed || 0);
  const rainNext6h = willRainInNextHours(forecast, 6);
  const maxPop6h = next6hMaxPop(forecast);

  // Rule 1: Rain probability high
  if (maxPop6h > 0.6) {
    adv.push({
      title: 'High chance of rain',
      message: `Rain probability > ${Math.round(maxPop6h*100)}% in the next 6 hours. Avoid irrigation and pesticide spraying today.`
    });
  }

  // Rule 2: High temperature
  if (temp >= 35) {
    adv.push({
      title: 'High temperature',
      message: `Temperature is ${temp}°C. Increase irrigation frequency for heat-sensitive crops and irrigate early morning or late evening to reduce evaporation.`
    });
  } else if (temp >= 30) {
    adv.push({
      title: 'Warm day',
      message: `Temperature ~${temp}°C. Monitor soil moisture; consider light additional watering for young plants.`
    });
  }

  // Rule 3: High wind speed
  if (windKmh > 15) {
    adv.push({
      title: 'Strong winds expected',
      message: `Wind speed ${Math.round(windKmh)} km/h. Do not spray pesticides due to drift risk. Secure lightweight greenhouse covers if present.`
    });
  }

  // Rule 4: High humidity
  if (humidity >= 80) {
    adv.push({
      title: 'High humidity',
      message: `Humidity is ${humidity}%. Possible risk of fungal infection — inspect leaves and consider preventive fungicide if warranted.`
    });
  }

  // Rule 5: Good spraying window
  const forecastNoRainLowWind = forecast.slice(0, 2).every(item => (item.pop || 0) < 0.2 && msToKmh(item.wind_speed||0) < 10);
  if (forecastNoRainLowWind) {
    adv.push({
      title: 'Good spraying window',
      message: 'No rain expected and wind < 10 km/h for next ~6 hours — safe to spray if needed.'
    });
  }

  // Rule 6: Low temp frost risk (example)
  if (temp <= 5) {
    adv.push({
      title: 'Frost risk',
      message: `Temperature ${temp}°C — frost risk for sensitive crops. Take protective measures overnight.`
    });
  }

  // If no advisories, return a positive one
  if (adv.length === 0) {
    adv.push({
      title: 'No immediate warnings',
      message: 'Weather looks stable based on current data. Continue regular crop management.'
    });
  }

  return adv;
}

module.exports = { generateAdvisories };
