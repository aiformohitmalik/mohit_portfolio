import './WeatherToggle.css';

const WEATHER_CYCLE = ['rain', 'clear', 'thunderstorm', 'drizzle', 'snow', 'fog', 'cloudy'];

const ICONS = {
  rain:         '🌧',
  clear:        '☀️',
  thunderstorm: '⛈',
  drizzle:      '🌦',
  snow:         '🌨',
  fog:          '🌫',
  cloudy:       '☁️',
};

export const WeatherToggle = ({ weather, onWeatherChange }) => {
  const currentIndex = WEATHER_CYCLE.indexOf(weather);

  const handleClick = () => {
    const next = WEATHER_CYCLE[(currentIndex + 1) % WEATHER_CYCLE.length];
    onWeatherChange(next);
  };

  return (
    <button className="weather-toggle" onClick={handleClick} title={`Weather: ${weather} — click to cycle`}>
      <span className="weather-toggle-icon">{ICONS[weather] ?? '🌡'}</span>
      <span className="weather-toggle-label">{weather}</span>
      <span className="weather-toggle-dev">DEV</span>
    </button>
  );
};

export default WeatherToggle;
