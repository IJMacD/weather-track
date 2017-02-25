import React from 'react'

import temperatureToColor from '../tempToColor';

import styles from '../styles/Grid.css';

export default (props) => {
  const { stations, large } = props;

  return (
    <ul className={styles.list}>{
      stations.map(station => {
        const { airTemperature, humidity, image } = station;
        const style = {
          backgroundColor: temperatureToColor(airTemperature),
          backgroundImage: image && `url(${image})`,
          height: large && 200,
          width: large && 200,
          fontSize: large && 24
        };
        return (
          <li key={station.name} className={styles.card} style={style}>
            <p className={styles.name}>{station.name}</p>
            <div className={styles.data}>
              { airTemperature &&
                <p>{parseFloat(airTemperature).toFixed(1)}°C</p>
              }
              { humidity &&
                <p>{humidity}%</p>
              }
            </div>
          </li>
        )
      })
    }</ul>
  )
}
