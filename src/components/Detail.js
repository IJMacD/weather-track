import React from 'react'

import temperatureToColor from '../tempToColor';

export default (props) => {
  const { station, onBackClick } = props;
  const {
    airTemperature,
    humidity,
    visibility,
  } = station;

  const jumboStyle = {
    backgroundColor: temperatureToColor(airTemperature),
    backgroundImage: station.image && `url(${station.image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50%',
    backgroundSize: 'cover',
    height: '100%',
    marginBottom: 0,
  };

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

  const toolbarStyle = {
    height: 64,
    backgroundColor: airTemperature ? temperatureToColor(airTemperature) : "#666",
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    color: 'white',
    display: 'flex',
  };

  const backStyle = {
    background: 0,
    border: 0,
    color: 'white',
    padding: '0 20px',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    marginLeft: 10,
  };

  const headerStyle = {
    display: station.image ? 'none' : '',
    color: station.airTemperature ? 'white' : '#333',
    fontSize: '5rem',
    padding: 30,
  };

  return (
    <div style={jumboStyle}>
      <div style={toolbarStyle}>
        <button onClick={onBackClick} style={backStyle}><i className="material-icons">arrow_back</i></button>
        <h1 style={titleStyle}>{ station.name }</h1>
      </div>
      <div style={headerStyle}>
        { station.name }
      </div>
      <div style={detailStyle}>
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
        { station.windGust &&
          <p>Wind Gust Speed: {station.windGust} km/h</p>
        }
      </div>
    </div>
  )
}
