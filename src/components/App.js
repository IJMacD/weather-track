import React from 'react'

import styles from '../styles/App.css';

export default class App extends React.Component {
  constructor () {
    super();
    
    this.state = {
      isLoading: true,
      stations: []
    };

    fetch('/weather').then(res => res.json()).then(weather => {
      const stations = weather.stations || [];
      const time = weather.time;

      this.setState({isLoading: false, stations, time})
    });
  }

  render () {
    const { isLoading, stations, time } = this.state;

    stations.sort((a,b) => b.airTemperature - a.airTemperature);

    return (
      <div>
        <div className={styles.jumbotron}>
          <h1>
            Weather Track
          </h1>
        </div>
        { isLoading ?
          <p className={styles.loading2}>Loading</p> :
          <div className={styles.container}>
            <h1>Weather Stations</h1>
            <p>Updated at { new Date(time).toString() }</p>
            <ul>{
              stations.map(station => (
                <li key={station.name}>
                  {station.name} { ' ' }
                  { station.airTemperature &&
                    <span style={{color:"#666",fontStyle:'italic',fontSize:12}}>{station.airTemperature}°C</span>
                  }
                </li>
              ))
            }</ul>
          </div>
        }
      </div>
    )
  }
}