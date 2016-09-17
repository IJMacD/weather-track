const Weather = require('./server/Weather');

Weather.getUpdate().then(function(data) {
  if(data) {
    const stations = values(data.stations);
    console.log("Loaded " + stations.length + " stations");
  }
  else {
    console.log("Error loading weather");
  }
  process.exit();
}).catch(e => console.error(e));

function values (object) {
  return Object.keys(object).map(key => object[key]);
}