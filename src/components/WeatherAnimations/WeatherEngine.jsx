import { RainAnimation } from './Rain/Rain';
import { ClearAnimation } from './Clear/Clear';

/**
 * Maps weather condition keys to their animation components.
 * Add new weather types here as they are built.
 */
const WEATHER_MAP = {
  rain:         RainAnimation,
  thunderstorm: RainAnimation,
  drizzle:      RainAnimation,
  clear:        ClearAnimation,
  // cloudy:    CloudyAnimation,   // placeholder — add when built
  // snow:      SnowAnimation,
  // fog:       FogAnimation,
};

const DEFAULT_WEATHER = 'rain';

/**
 * Renders the appropriate background weather animation based on the
 * `weather` prop (lowercase string key, e.g. "rain", "clear", "snow").
 *
 * Falls back to the rain animation when the key is unknown or omitted.
 * Drop this component anywhere you want a full-bleed weather canvas.
 */
export const WeatherEngine = ({ weather = DEFAULT_WEATHER }) => {
  const Animation = WEATHER_MAP[weather] ?? WEATHER_MAP[DEFAULT_WEATHER];
  return <Animation />;
};

export default WeatherEngine;
