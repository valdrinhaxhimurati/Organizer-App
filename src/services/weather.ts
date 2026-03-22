import type { WeatherSnapshot } from '../lib/types';

const CACHE_KEY = 'organizer-weather-cache';

export async function getWeather(latitude: number, longitude: number): Promise<WeatherSnapshot> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));
  url.searchParams.set('current', 'temperature_2m,wind_speed_10m,weather_code');

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Weather request failed');
    }
    const data = await response.json();
    const snapshot: WeatherSnapshot = {
      temperature: data.current.temperature_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      fetchedAt: new Date().toISOString()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
    return snapshot;
  } catch (error) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as WeatherSnapshot;
    }
    throw error;
  }
}