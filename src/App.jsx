import React, { useState, useEffect } from 'react';
import { MapPin, Droplet, Wind, ThermometerSun } from 'lucide-react';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // API key - consider using environment variables in production
  const API_KEY = 'ac5ab866b038cd5a371966670747fc06';

  const fetchWeatherData = async () => {
    // Reset previous states
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Location not found. Please check the city name.');
      }

      const data = await response.json();
      setWeatherData(data);
      setLocation(''); // Clear input after successful search
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    // Allow search on Enter key press as well
    if (e.key === 'Enter' || e.type === 'click') {
      if (location.trim()) {
        fetchWeatherData();
      }
    }
  };

  // Function to get background based on weather condition
  const getWeatherBackground = () => {
    if (!weatherData) return '';
    const condition = weatherData.weather[0]?.main.toLowerCase();
    const backgrounds = {
      'clear': 'bg-gradient-to-r from-blue-400 to-blue-600',
      'clouds': 'bg-gradient-to-r from-gray-400 to-gray-600',
      'rain': 'bg-gradient-to-r from-blue-800 to-indigo-900',
      'snow': 'bg-gradient-to-r from-white to-blue-200',
      'thunderstorm': 'bg-gradient-to-r from-gray-900 to-blue-900',
      'drizzle': 'bg-gradient-to-r from-blue-300 to-blue-500'
    };
    return backgrounds[condition] || 'bg-gradient-to-r from-blue-500 to-blue-700';
  };

  return (
    <div className={`app ${getWeatherBackground()}`}>
      <div className="background">
        <div className="search-container">
          <input
            type="text"
            className="location-input"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleSearch}
          />
          <button 
            onClick={handleSearch} 
            className="search-button"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          {error && (
            <div className="text-red-500 mt-2 text-center">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-white text-center mt-10 animate-pulse">
            Loading weather data...
          </div>
        ) : weatherData ? (
          <div className="weather-display animate-fade-in">
            <div className="temperature-info">
              <h1 className="temperature">
                {Math.round(weatherData.main?.temp)}°C
              </h1>
              <h2 className="city-name flex items-center">
                <MapPin className="mr-2" /> {weatherData.name}, {weatherData.sys?.country}
              </h2>
            </div>
            <div className="weather-condition">
              <h2>{weatherData.weather[0]?.description}</h2>
              <img
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0]?.icon}@2x.png`}
                alt="weather icon"
                className="weather-icon"
              />
            </div>
          </div>
        ) : (
          <div className="weather-info-placeholder text-black text-center mt-10"><br />
            Enter a location to get weather details.
          </div>
        )}

        {weatherData && (
          <div className="additional-info">
            <div className="weather-item">
              <ThermometerSun className="inline-block mr-2" />
              Feels Like: {Math.round(weatherData?.main?.feels_like || 0)}°C
            </div>
            <div className="weather-item">
              <Droplet className="inline-block mr-2" />
              Humidity: {weatherData?.main?.humidity || 'N/A'}%
            </div>
            <div className="weather-item">
              <Wind className="inline-block mr-2" />
              Wind Speed: {weatherData?.wind?.speed || 'N/A'} m/s
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;