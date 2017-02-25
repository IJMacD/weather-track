import React from 'react'

import Grid from './Grid';

import { sorter } from '../util/array';

import styles from '../styles/App.css';

export default (props) => {
  const { stations, size, time, onStationClick, onSizeToggle } = props;

  stations.sort(sorter(s => -s.airTemperature || null, s => s.name));

  return (
    <div className={styles.container}>
      <h1>Weather Stations</h1>
      <p>Updated at { new Date(time).toString() } <button onClick={onSizeToggle}>{size=="large"?"Small":"Large"}</button></p>
      <Grid stations={stations} large={size=="large"} onStationClick={onStationClick} />
    </div>
  )
}
