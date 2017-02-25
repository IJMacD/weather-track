import React from 'react'

import temperatureToColor from '../tempToColor';

export default (props) => {
  const { station, onBackClick } = props;
  const {
    airTemperature,
    humidity,
    visibility,
  } = station;

  const detailStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  };

  return (
    <div>
      <button onClick={onBackClick} style={{position: 'absolute', top: 20, left: 10}}>Back</button>
      <div style={detailStyle}>
        <h1>{ station.name }</h1>
        { airTemperature &&
          <p>Air Temperature: {parseFloat(airTemperature).toFixed(1)}°C</p>
        }
        { humidity &&
          <p>Humidity: {humidity}%</p>
        }
        { visibility &&
          <p>Visibility: {visibility}m</p>
        }
        { station.minAirTemperature &&
          <p>Min Air Temperature: {station.minAirTemperature}°C</p>
        }
        { station.maxAirTemperature &&
          <p>Max Air Temperature: {station.maxAirTemperature}°C</p>
        }
        { station.grassTemperature &&
          <p>Grass Temperature: {station.grassTemperature}°C</p>
        }
        { station.minGrassTemperature &&
          <p>Min Grass Temperature: {station.minGrassTemperature}°C</p>
        }
        { station.maxGrassTemperature &&
          <p>Max Grass Temperature: {station.maxGrassTemperature}°C</p>
        }
        { station.seaLevelPressure &&
          <p>Sea Level Pressure: {station.seaLevelPressure} mBar</p>
        }
        { station.windDirection &&
          <p>Wind Direction: {station.windDirection}</p>
        }
        { station.windSpeed &&
          <p>Wind Speed: {station.windSpeed} km/h</p>
        }
        { station.windGustSpeed &&
          <p>Wind Gust Speed: {station.windGustSpeed} km/h</p>
        }
      </div>
    </div>
  )
}
