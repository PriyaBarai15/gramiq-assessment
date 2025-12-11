import React, { useState } from 'react';
import { fetchWeather } from './services/api';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import AdvisoryBox from './components/AdvisoryBox';
import TrendChart from './components/TrendChart';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (location) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchWeather(location);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="container">
        <h1><span className="brand-mark">FA</span> Farm Weather & Advisory</h1>
        <SearchBar onSearch={handleSearch} loading={loading} />
        {error && <div className="error">{error}</div>}
        {data && (
          <>
            <WeatherCard current={data.current} location={data.location} />
            <TrendChart forecast={data.forecast} />
            <AdvisoryBox advisories={data.advisories} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
