var express = require('express');
var path = require('path');

module.exports = {
  app: function () {
    var app = express();

    var indexPath = path.join(__dirname, 'src', 'index.html');

    if(process.env.NODE_ENV != "production") {
      indexPath = path.join(__dirname, 'index.html');
    }

    app.get('/', function(request, response) {
      response.sendFile(indexPath);
    });

    app.use(express.static(path.join(__dirname, 'public')));

    return app;
  }
}
