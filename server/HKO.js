const url = "http://www.hko.gov.hk/textonly/v2/forecast/text_readings_e.htm";

module.exports = {
  getWeather: function () {
    return fetch(url).then(scrapeHTML).catch(e => console.error(e));
  }
};

function fetch(url) {
  var request = require('request');

  return new Promise(function(resolve, reject){
    request(url, function(error, response, html) {
      if(error) {
        reject(error);
      }
      resolve(html);
    });
  });
}

function scrapeHTML (html) {
  var cheerio = require('cheerio');

  var $ = cheerio.load(html);

  var table = $('pre').get(0);

  if(table) {
    const tokens = tokenizer($(table).text());
    const data = parser(tokens);

    return data;
  }
}

function tokenizer (text) {
  return text.split(/\r?\n/);
}

function parser (tokens) {
  const data = {};
  let lineIndex = 0;

  lineIndex = skipBlankLines(tokens, lineIndex);
  
  lineIndex = parseDateLine(tokens, lineIndex, data);

  lineIndex = skipBlankLines(tokens, lineIndex);

  lineIndex = parseTemperatureTable(tokens, lineIndex, data);

  lineIndex = skipBlankLines(tokens, lineIndex);

  lineIndex = parseWindTable(tokens, lineIndex, data);

  lineIndex = skipBlankLines(tokens, lineIndex);

  lineIndex = parsePressureTable(tokens, lineIndex, data);

  lineIndex = skipBlankLines(tokens, lineIndex);

  lineIndex = parseVisibilityTable(tokens, lineIndex, data);

  lineIndex = skipBlankLines(tokens, lineIndex);

  lineIndex = parseSolarTable(tokens, lineIndex, data);

  return data;
}

function skipBlankLines (tokens, lineIndex) {
  while(!tokens[lineIndex]){
    lineIndex++;
  }
  return lineIndex;
}

function parseDateLine (tokens, lineIndex, data) {
  const moment = require('moment');
  const line = tokens[lineIndex];

  if(line) {
    const timeMatch = line.match(/\d\d:\d\d/);
    const dateMatch = line.match(/\d\d? [a-z]+ \d\d\d\d/i);

    if(timeMatch && dateMatch) {
      data.date = moment(dateMatch[0] + " " + timeMatch[0] + " +08:00", "D MMMM YYYY HH:mm Z");
    }
  }

  return lineIndex + 1;
}

function parseTemperatureTable (tokens, lineIndex, data) {
  // Skip 5 lines for headings
  lineIndex += 5;

  const stations = data.stations || {};
  data.stations = stations;

  while (tokens[lineIndex]){
    const line = tokens[lineIndex++];
    const tokes = line.split(/\s{2,}/);

    const name = tokes[0];
    const airTemperature = parseFloat(tokes[1]);
    const humid = parseInt(tokes[2]);
    const min_max = tokes[3].replace("*", "").split(/\s*\/\s*/);
    const minAirTemperature = parseFloat(min_max[1]);
    const maxAirTemperature = parseFloat(min_max[0]);

    const station = {
      name
    };

    if (!isNaN(airTemperature))     station.airTemperature = airTemperature;
    if (!isNaN(humid))              station.humidity = humid;
    if (!isNaN(minAirTemperature))  station.minAirTemperature = minAirTemperature;
    if (!isNaN(maxAirTemperature))  station.maxAirTemperature = maxAirTemperature;

    if (tokes[5]) {
      const grass = parseFloat(tokes[4]);
      const min_grass = parseFloat(tokes[5]);
      if(!isNaN(grass)) {
        station.grassTemperature = grass;
      }
      if(!isNaN(min_grass)) {
        station.minGrassTemperature = min_grass;
      }
    }
    else if (tokes[4]) {
      const min_grass = parseFloat(tokes[4]);
      if(!isNaN(min_grass)) {
        station.minGrassTemperature = min_grass;
      }
    }

    stations[name] = station;
  }

  data.stations = stations;

  return lineIndex;
}

function parseWindTable (tokens, lineIndex, data) {
  // Skip header line
  lineIndex++;

  const stations = data.stations || {};
  data.stations = stations;

  while (tokens[lineIndex]){
    const line = tokens[lineIndex++];
    const tokes = line.split(/\s{2,}/);

    const name = tokes[0];
    const direction = tokes[1];
    const speed = parseInt(tokes[2]);
    const gust = parseInt(tokes[3]);

    const station = stations[name] || {};
    stations[name] = station;

    station.name = name;
    if(direction != "N/A") station.windDirection = direction;
    if(!isNaN(speed)) station.windSpeed = speed;
    if(!isNaN(gust)) station.windGust = gust;
  }

  return lineIndex;
}

function parsePressureTable (tokens, lineIndex, data) {
  // Skip header line
  lineIndex++;

  const stations = data.stations || {};
  data.stations = stations;

  while (tokens[lineIndex]){
    const line = tokens[lineIndex++];
    const tokes = line.split(/\s{2,}/);

    const name = tokes[0];
    const pressure = parseFloat(tokes[1]);

    const station = stations[name] || {};
    stations[name] = station;

    station.name = name;
    if(!isNaN(pressure)) station.seaLevelPressure = pressure;
  }

  return lineIndex;
}

function parseVisibilityTable (tokens, lineIndex, data) {
  // Skip header line
  lineIndex++;

  const stations = data.stations || {};
  data.stations = stations;

  while (tokens[lineIndex]){
    const line = tokens[lineIndex++];
    const tokes = line.split(/\s{2,}/);

    const name = tokes[0];
    const dist = parseInt(tokes[1]);

    const station = stations[name] || {};
    stations[name] = station;

    station.name = name;
    if(!isNaN(dist)) station.visibility = dist;
  }

  return lineIndex;
}

function parseSolarTable (tokens, lineIndex, data) {
  // Skip two header lines
  lineIndex += 2;

  const stations = data.stations || {};
  data.stations = stations;

  while (tokens[lineIndex]){
    const line = tokens[lineIndex++];
    const tokes = line.split(/\s{2,}/);

    const name = tokes[0];
    const global = parseFloat(tokes[1]);
    const direct = parseFloat(tokes[2]);
    const diffuse = parseFloat(tokes[3]);

    const station = stations[name] || {};
    stations[name] = station;

    station.name = name;
    if(!isNaN(global)) station.globalSolar = global;
    if(!isNaN(direct)) station.directSolar = direct;
    if(!isNaN(diffuse)) station.diffuseSolar = diffuse;
  }

  return lineIndex;
}