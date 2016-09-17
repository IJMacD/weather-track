const HKO = require('./HKO');
const WeatherDB = require('./WeatherDB'); 

module.exports = {
  getUpdate: function () {
    return HKO.getWeather().then(function(data){
      if(data && data.stations && data.date) {
        const stations = values(data.stations);
        const time = data.date.valueOf();

        const promises = stations.map(station => WeatherDB.update(station, time));

        return Promise.all(promises).then(() => data);
      }

      return Promise.reject("No valid data returned from HKO module");
    });
  }
}

function values (object) {
  return Object.keys(object).map(key => object[key]);
}