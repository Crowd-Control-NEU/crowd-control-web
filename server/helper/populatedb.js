var pg = require('../models/knexfile');
var format = require('pg-format');

var sampleHistoricalData = [];

var sampleLiveData = [
    {'location_name':'Rebeccas', 'count':25},
    {'location_name':'Curry Student Center', 'count':100},
    {'location_name':'Snell', 'count':60}
];

// clear the database of any existing rows
function clearTable() {
    pg('historical_data').del().then(
        pg('live_data').del().then(
    ))
}

// populate the database
function populateHistoricalData() {
    var date = new Date();
    for (var i = 60; i >= 1; i--) {
      var newDate = new Date(date.getTime() - 24*60*60*1000*i);
      addRandomCountForLocation(newDate, 'Curry Student Center');
      addRandomCountForLocation(newDate, 'Rebeccas');
      addRandomCountForLocation(newDate, 'Snell');
    }
    pg('historical_data').insert(sampleHistoricalData).then()
}

// add random count to historical data for a given date and location
function addRandomCountForLocation(date, location) {
  var count = Math.floor(Math.random() * 50);
  var newData = {'location_name': location, 'count': count, 'date': date};
  sampleHistoricalData.push(newData);
}

function populateLiveData() {
   pg.insert(sampleLiveData).into('live_data').then()
}
function populatedb() {
    populateHistoricalData();
    populateLiveData();
}

clearTable();
populatedb();
pg.destroy(); //Close connection
