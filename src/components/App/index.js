import React from 'react'

import Summary from '../Summary';
import Detail from '../Detail';

import styles from './App.css';

export default class App extends React.Component {
  constructor () {
    super();

    this.state = {
      isLoading: true,
      stations: [],
      size: "small",
      page: "",
      station: null,
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
      const station = this.findStation(this.state.station && this.state.station.id);

      this.setState({isLoading: false, stations, time, station})
    });
  }

  toggleSize () {
    this.setState({size:this.state.size=="large"?"small":"large"});
  }

  showSummary () {
    this.setState({page: ""});
  }

  showDetail (id) {
    const station = this.findStation(id);
    this.setState({
      page: "detail",
      station,
    });
  }

  findStation (id) {
    return this.state.stations.filter(s => s.id == id)[0];
  }

  render () {
    const { isLoading, stations, time, size, page, station } = this.state;

    return (
      <div>
        { isLoading ?
          <p className={styles.loading2}>Loading</p> :
          page == "detail" ?
            <Detail
              station={ station }
              onBackClick={() => this.showSummary()}
            />
            :
            <Summary
              stations={stations}
              time={time}
              size={size}
              onSizeToggle={() => this.toggleSize()}
              onStationClick={station => this.showDetail(station)}
            />
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
