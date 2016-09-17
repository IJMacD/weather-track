var pg = require('pg');
pg.defaults.ssl = true;

module.exports = {

  update: function (station, time) {
    // console.log(station.name, time);
    const sql = "INSERT INTO weather_updates ("
        + "station_name, time, "
        + "air_temperature, relative_humidity, min_air_temperature, max_air_temperature, "
        + "grass_temperature, min_grass_temperature, "
        + "wind_direction, wind_speed, wind_gust, "
        + "sea_level_pressure, visibility, "
        + "global_solar, direct_solar, diffuse_solar) "
      + "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) "
      + "ON CONFLICT ON CONSTRAINT station_time DO UPDATE SET "
        + "station_name = $1, time = $2, "
        + "air_temperature = $3, relative_humidity = $4, min_air_temperature = $5, max_air_temperature = $6, "
        + "grass_temperature = $7, min_grass_temperature = $8, "
        + "wind_direction = $9, wind_speed = $10, wind_gust = $11, "
        + "sea_level_pressure = $12, visibility = $13, "
        + "global_solar = $14, direct_solar = $15, diffuse_solar = $16";
    const params = [
      station.name,
      time,
      station.airTemperature,
      station.humidity,
      station.minAirTemperature,
      station.maxAirTemperature,
      station.grassTemperature,
      station.minGrassTemperature,
      station.windDirection,
      station.windSpeed,
      station.windGust,
      station.seaLevelPressure,
      station.visibility,
      station.globalSolar,
      station.directSolar,
      station.diffuseSolar
    ];

    return query(sql, params).catch(e => console.error(e));
  }
};

function query (sql, params) {
  return new Promise(function(resolve, reject){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      if (err) { console.error(err); reject(err); }
      else {
        client.query(sql, params, function(err, result) {
          done();
          if (err)
          { console.error(err); reject(err); }
          else
          { resolve(result); }
        });
      }
    });
  });
}
