var pg = require('pg');
pg.defaults.ssl = true;

module.exports = {

  getWeather: function () {
    const sql = "SELECT DISTINCT ON (name)"
          + "name, time, abbreviation, webcam_url, "
          + "air_temperature, relative_humidity, min_air_temperature, max_air_temperature, "
          + "grass_temperature, min_grass_temperature, "
          + "wind_direction, wind_speed, wind_gust, "
          + "sea_level_pressure, visibility, "
          + "global_solar, direct_solar, diffuse_solar "
        + "FROM weather_updates "
        + "RIGHT OUTER JOIN weather_stations ON station_name = name "
        + "ORDER BY name, time DESC";

    return query(sql).then(result => {
      return {
        stations: result.rows.map(stationFromDBRow),
        time: Math.max.apply(null, result.rows.map(r => parseInt(r.time) || 0))
      }
    });
  },

  getStation: function (stationID) {
    const moment = require('moment');
    const cutoff = moment().subtract(1, "day").valueOf();
    const sql = "SELECT "
          + "name, time, "
          + "webcam_url, abbreviation, "
          + "air_temperature, relative_humidity, min_air_temperature, max_air_temperature, "
          + "grass_temperature, min_grass_temperature, "
          + "wind_direction, wind_speed, wind_gust, "
          + "sea_level_pressure, visibility, "
          + "global_solar, direct_solar, diffuse_solar "
        + "FROM weather_updates "
        + "RIGHT OUTER JOIN weather_stations ON station_name = name "
        + "WHERE abbreviation = $1 AND time > $2"
        + "ORDER BY time DESC";
    const params = [
      stationID,
      cutoff
    ];

    return query(sql, params).then(result => {
      if(result.rows.length == 0){
        return Promise.reject("No data for specified station: " + stationID);
      }

      return {
        id: result.rows[0].abbreviation,
        name: result.rows[0].name,
        image: result.rows[0].webcam_url,
        updates: result.rows.map(updateFromDBRow)
      };
    }, e => {
      console.error(e);
      console.debug("Error on query: " + sql);
    });
  },

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

function stationFromDBRow (row) {
  return Object.assign({
    id:                   row.abbreviation,
    name:                 row.name,
    image:                row.webcam_url
  }, updateFromDBRow(row));
}

function updateFromDBRow (row) {
  return {
    time:                 parseIntOrUndefined(row.time),
    airTemperature:       parseFloatOrUndefined(row.air_temperature),
    humidity:             parseFloatOrUndefined(row.relative_humidity),
    minAirTemperature:    parseFloatOrUndefined(row.min_air_temperature),
    maxAirTemperature:    parseFloatOrUndefined(row.max_air_temperature),
    grassTemperature:     parseFloatOrUndefined(row.grass_temperature),
    minGrassTemperature:  parseFloatOrUndefined(row.min_grass_temperature),
    windDirection:        row.wind_direction || undefined,
    windSpeed:            parseFloatOrUndefined(row.wind_speed),
    windGust:             parseFloatOrUndefined(row.wind_gust),
    seaLevelPressure:     parseFloatOrUndefined(row.sea_level_pressure),
    visibility:           parseFloatOrUndefined(row.visibility),
    globalSolar:          parseFloatOrUndefined(row.globalSolar),
    directSolar:          parseFloatOrUndefined(row.directSolar),
    diffuseSolar:         parseFloatOrUndefined(row.diffuseSolar)
  }
}

function parseIntOrUndefined(number) {
  return number == null ? undefined : parseInt(number);
}

function parseFloatOrUndefined(number) {
  return number == null ? undefined : parseFloat(number);
}
