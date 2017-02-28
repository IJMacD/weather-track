import React from 'react'

import Grid from './Grid';

import temperatureToColor from '../tempToColor';
import { sorter, sum } from '../util/array';

import styles from './App/App.css';

export default (props) => {
  const { stations, size, time, onStationClick, onSizeToggle } = props;

  stations.sort(sorter(s => -s.airTemperature || null, s => s.name));

  const withTemp = stations.filter(s => s.airTemperature);
  const avgTemp = withTemp.map(s => s.airTemperature).reduce(sum, 0) / withTemp.length;

  const jumboStyle = {
    backgroundColor: temperatureToColor(avgTemp),
  };

  return (
    <div>
      <div className={styles.jumbotron} style={jumboStyle}>
        <h1>Weather Track</h1>
      </div>
      <div className={styles.container}>
        <h1>Weather Stations</h1>
        <p>Updated at { new Date(time).toString() } <button onClick={onSizeToggle}>{size=="large"?"Small":"Large"}</button></p>
        <Grid stations={stations} large={size=="large"} onStationClick={onStationClick} />
      </div>
    </div>
  )
}
