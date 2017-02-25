import React from 'react'

import Grid from './Grid';
import { sorter, sum } from '../util/array';
import temperatureToColor from '../tempToColor';

import styles from '../styles/App.css';

export default class App extends React.Component {
  constructor () {
    super();

    this.state = {
      isLoading: true,
      stations: [],
      size: "small"
    };

    this.loadData();

    setInterval(this.loadData.bind(this), 60 * 1000);
  }

  loadData () {
    fetch('/weather').then(res => res.json()).then(weather => {
      const stations = weather.stations || [];

      return preloadImages(stations).then(() => weather);
    }).then(weather => {
      const stations = weather.stations || [];
      const time = weather.time;

      this.setState({isLoading: false, stations, time})
    });
  }

  toggleSize () {
    this.setState({size:this.state.size=="large"?"small":"large"});
  }

  render () {
    const { isLoading, stations, time, size } = this.state;

    stations.sort(sorter(s => -s.airTemperature || null, s => s.name));

    const withTemp = stations.filter(s => s.airTemperature);
    const avgTemp = withTemp.map(s => s.airTemperature).reduce(sum, 0) / withTemp.length;

    const jumboStyle = {
      background: temperatureToColor(avgTemp)
    };

    return (
      <div>
        <div className={styles.jumbotron} style={jumboStyle}>
          <h1>
            Weather Track
          </h1>
        </div>
        { isLoading ?
          <p className={styles.loading2}>Loading</p> :
          <div className={styles.container}>
            <h1>Weather Stations</h1>
            <p>Updated at { new Date(time).toString() } <button onClick={()=>this.toggleSize()}>{size=="large"?"Small":"Large"}</button></p>
            <Grid stations={stations} large={size=="large"} />
          </div>
        }
      </div>
    )
  }
}

function preloadImages (stations) {
  const now = Date.now();
  return Promise.all(
    stations
      .filter(s=>s.image)
      .map(s => {
        const url = `${s.image}?time=${now}`;
        s.image = url;
        return preloadImage(url).then(img => {
          if(img.height == 200) {
            // Smaller image (355x200) means image unavailable message
            s.image = null;
          }
        }, e => {
          console.info("Image not found: " + url);
        });
      })
  );
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}
