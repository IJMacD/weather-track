var express = require('express');
var path = require('path');

module.exports = {
  app: function () {
    var app = express();

    var indexPath = path.join(__dirname, '/../src', 'index.html');

    if(process.env.NODE_ENV != "production") {
      indexPath = path.join(__dirname, '/../index.html');
    }

    app.get('/', function(request, response) {
      response.sendFile(indexPath);
    });

    app.get('/weather', function(request, response) {
      const WeatherDB = require('./WeatherDB');

      WeatherDB.getWeather().then(weather => {
        response.send(JSON.stringify(weather));
      }).catch(error => {
        response.send(JSON.stringify({error}));
      });

    });

    app.get('/weather/stations/:stationID', function (request, response) {
      const WeatherDB = require('./WeatherDB');

      WeatherDB.getStation(request.params.stationID).then(station => {
        response.send(JSON.stringify(station));
      }).catch(error => {
        response.send(JSON.stringify({error}));
      });
    });

    app.use(express.static(path.join(__dirname, 'public')));

    return app;
  }
}
