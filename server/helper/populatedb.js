var pg = require('../models/knexfile');
var format = require('pg-format');
var moment = require('moment');

var sampleHistoricalData = [];
var sampleHistoricalDataWollastons = [];

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
    var date = moment().startOf('day').toDate();
    for (var i = 60; i >= 1; i--) { // Adds data for the last 60 days
      var newDate = new Date(date.getTime() - 24*60*60*1000*i);
      addCountsForDay(newDate, 'Curry Student Center');
      addCountsForDay(newDate, 'Rebeccas');
      addCountsForDay(newDate, 'Snell');
    }
    pg('historical_data').insert(sampleHistoricalData).then()
}

// populate the 3 years worth of data for Wollastons example
function populateHistoricalDataForWollastons() {
  var date = moment().startOf('day').toDate();
  for (var i = 1000; i >= 1; i--) { // Adds data for the last 60 days
    var newDate = new Date(date.getTime() - 24*60*60*1000*i);
    var newData = {'location_name': "Wollastons", 'count': 3, 'date': newDate};
    sampleHistoricalDataWollastons.push(newData);
  }
  pg('historical_data').insert(sampleHistoricalDataWollastons).then()
}

// Adds counts every 15 minutes for a day
function addCountsForDay(date, location) {
  var sum = 0;
  for (var i = 0; i < 96; i++) {
    sum += addRandomCountForLocation(date, location, sum);
    date = moment(date).add(15, 'm').toDate();
  }
}

// add random count (-5 to 5) to historical data for a given date and location
function addRandomCountForLocation(date, location, sum) {
  var count = Math.floor(Math.random() * 11) - 5;
  if (sum + count < 0) { // insures that total count will never be negative for a day
    count = 0;
  }
  var newData = {'location_name': location, 'count': count, 'date': date};
  sampleHistoricalData.push(newData);
  return count;
}

function populateLiveData() {
   pg.insert(sampleLiveData).into('live_data').then()
}
function populatedb() {
    populateHistoricalData();
    populateHistoricalDataForWollastons();
    populateLiveData();
}

clearTable();
populatedb();
pg.destroy(); //Close connection
