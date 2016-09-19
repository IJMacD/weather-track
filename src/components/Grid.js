import React from 'react'

import { colorMix } from '../util/color.js';

import styles from '../styles/Grid.css';

export default (props) => {
  const { stations, large } = props;
  
  return (
    <ul className={styles.list}>{
      stations.map(station => {
        const { airTemperature, image } = station;
        const tempFactor = Math.max(Math.min((airTemperature - 10) / 25, 1), 0);
        const style = {
          backgroundColor: airTemperature ? colorMix([0,0,128],[192,64,0],tempFactor) : null,
          backgroundImage: image && `url(${image})`,
          height: large && 200,
          width: large && 200,
          fontSize: large && 24
        };
        return (
          <li key={station.name} className={styles.card} style={style}>
            <p className={styles.name}>{station.name}</p>
            <div className={styles.data}>
              { station.airTemperature &&
                <p>{parseFloat(station.airTemperature).toFixed(1)}°C</p>
              }
              { station.humidity &&
                <p>{station.humidity}%</p>
              }
            </div>
          </li>
        )
      })
    }</ul>
  )
}