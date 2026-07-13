import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Fetches the visitor's approximate weather from the server once on mount.
 * The server resolves: visitor IP → ip-api.com lat/lon → OpenWeatherMap condition.
 *
 * Returns { weather, city, country, loading }
 * Falls back to 'rain' on any network or API error.
 */
export function useWeather() {
  const [state, setState] = useState({ weather: 'rain', city: null, country: null, loading: true });

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/api/weather`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) setState({ ...data, loading: false });
      })
      .catch(() => {
        if (!cancelled) setState({ weather: 'rain', city: null, country: null, loading: false });
      });

    return () => { cancelled = true; };
  }, []);

  return state;
}
