import { colorMix } from './util/color';

export default function temperatureToColor (temperature) {
  const tempFactor = Math.max(Math.min((temperature - 10) / 25, 1), 0);
  return temperature ? colorMix([0,0,128], [192,64,0], tempFactor*tempFactor) : null;
}
