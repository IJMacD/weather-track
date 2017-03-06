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
      stationMap: {},
      size: "small",
      page: "",
      stationId: null,
    };

    this.loadData();

    setInterval(this.loadData.bind(this), 60 * 1000);
  }

  loadData () {
    const oldMap = this.state.stationMap;

    fetch('/weather').then(res => res.json()).then(weather => {
      const stationMap = {};
      const stations = (weather.stations || []).map(s => {
        stationMap[s.id] = s;

        // Intercept images to reduce flicker
        s.originalImage = s.image;
        s.image = oldMap[s.id] ? oldMap[s.id].image : null;

        return s.id;
      });

      preloadImages(stations, stationMap).then(() => this.setState({stations}));

      const time = weather.time;

      this.setState({isLoading: false, stations, stationMap, time })
    });
  }

  toggleSize () {
    this.setState({size:this.state.size=="large"?"small":"large"});
  }

  showSummary () {
    this.setState({page: ""});
  }

  showDetail (id) {
    this.setState({
      page: "detail",
      stationId: id,
    });
  }

  render () {
    const { isLoading, stations, stationMap, time, size, page, stationId } = this.state;
    const station = stationMap[stationId];
    const stationsList = stations.map(id => stationMap[id]);

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
              stations={stationsList}
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

function preloadImages (stations, stationMap) {
  const now = Date.now();

  return Promise.all(
    stations
      .map(id => stationMap[id])
      .filter(s=>s && s.originalImage)
      .map(s => {
        const url = `${s.originalImage}?time=${now}`;
        return preloadImage(url).then(img => {
          if(img.height != 200) {
            // Smaller image (355x200) means image unavailable message
            s.image = url;
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
