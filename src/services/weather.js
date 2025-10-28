const GEOCODING = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER = "https://api.open-meteo.com/v1/forecast";

export async function fetchCoordsForCity(name) {
  const url = `${GEOCODING}?name=${encodeURIComponent(name)}&count=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results?.length) return null;
  const loc = data.results[0];
  return {
    name: `${loc.name}, ${loc.country}`,
    latitude: loc.latitude,
    longitude: loc.longitude
  };
}

export async function fetchCurrentWeather(lat, lon) {
  const url = `${WEATHER}?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();
  const w = data.current_weather;
  return {
    temperature: w.temperature,
    windspeed: w.windspeed,
    winddirection: w.winddirection,
    time: w.time,
    weather_description: codeToDescription(w.weathercode)
  };
}

function codeToDescription(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    51: "Light drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Snowfall",
    95: "Thunderstorm"
  };
  return map[code] || `Code ${code}`;
}