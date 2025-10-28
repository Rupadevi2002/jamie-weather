import React, { useState } from "react";
import { fetchCoordsForCity, fetchCurrentWeather } from "./services/weather";

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("");

  async function searchCity() {
    setError("");
    if (!city.trim()) return setError("Please enter a city name");
    setLoading(true);
    try {
      const coords = await fetchCoordsForCity(city);
      if (!coords) {
        setError("City not found");
        setWeather(null);
        return;
      }
      setLocationName(coords.name);
      const data = await fetchCurrentWeather(coords.latitude, coords.longitude);
      setWeather(data);
    } catch {
      setError("Could not fetch weather");
    } finally {
      setLoading(false);
    }
  }

  async function useMyLocation() {
    setError("");
    if (!navigator.geolocation)
      return setError("Geolocation not supported by your browser");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const data = await fetchCurrentWeather(latitude, longitude);
        setWeather(data);
        setLocationName("Your location");
        setLoading(false);
      },
      () => {
        setError("Unable to access location");
        setLoading(false);
      }
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
        JamieWeather
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g., London)"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
        />
        <button
          onClick={searchCity}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
        <button
          onClick={useMyLocation}
          className="bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          📍
        </button>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {loading && <p>Loading...</p>}

      {weather && !loading && (
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-2">{locationName}</h2>
          <p className="text-lg">
            🌡 Temperature: <b>{weather.temperature} °C</b>
          </p>
          <p>
            💨 Wind: {weather.windspeed} m/s ({weather.winddirection}°)
          </p>
          <p>🌦 Condition: {weather.weather_description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Updated: {weather.time}
          </p>
        </div>
      )}

      <footer className="text-center text-gray-500 text-sm mt-4">
        Data by Open-Meteo (no API key)
      </footer>
    </div>
  );
}