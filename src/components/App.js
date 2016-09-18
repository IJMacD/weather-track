import React from 'react'

import Grid from './Grid';
import { sorter } from '../util/array';

import styles from '../styles/App.css';

export default class App extends React.Component {
  constructor () {
    super();
    
    this.state = {
      isLoading: true,
      stations: []
    };

    this.loadData();

    setInterval(this.loadData.bind(this), 60 * 1000);
  }

  loadData () {
    fetch('/weather').then(res => res.json()).then(weather => {
      const stations = weather.stations || [];
      const now = Date.now();

      return Promise.all(
        stations
          .filter(s=>s.image)
          .map(s => {
            const url = `${s.image}?time=${now}`;
            s.image = url;
            return url;
          })
          .map(preloadImage)
        ).then(() => weather);
    }).then(weather => {
      const stations = weather.stations || [];
      const time = weather.time;

      this.setState({isLoading: false, stations, time})
    });
  }

  render () {
    const { isLoading, stations, time } = this.state;

    stations.sort(sorter(s => -s.airTemperature, s => s.name));

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
            <Grid stations={stations} />
          </div>
        }
      </div>
    )
  }
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}