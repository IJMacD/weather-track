import React from 'react'

import { colorMix } from '../util/color.js';

import styles from '../styles/Grid.css';

export default (props) => {
  const { stations } = props;
  
  return (
    <ul className={styles.list}>{
      stations.map(station => {
        const { airTemperature, image } = station;
        const tempFactor = Math.max(Math.min((airTemperature - 10) / 25, 1), 0);
        const style = {
          backgroundColor: airTemperature ? colorMix([0,0,128],[192,64,0],tempFactor) : null,
          backgroundImage: image && `url(${image})`
        };
        return (
          <li key={station.name} className={styles.card} style={style}>
            {station.name}
            { station.airTemperature &&
              <div className={styles.temp}>{parseFloat(station.airTemperature).toFixed(1)}°C</div>
            }
            { station.humidity &&
              <div className={styles.temp}>{station.humidity}%</div>
            }
          </li>
        )
      })
    }</ul>
  )
}