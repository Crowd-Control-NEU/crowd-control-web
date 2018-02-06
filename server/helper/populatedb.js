var username = require('os').userInfo().username;
var conString = process.env.DB_URL || "postgres://postgres:5432@localhost/" + username;
var pg = require('knex')({
    client: 'pg',
    connection: conString,
    searchPath: ['knex', 'public']
});
var format = require('pg-format');

var sampleHistoricalData = [
    {'location_name':'Rebeccas', 'count': 1, 'date':'2018-01-16 15:57:16.736741'},
    {'location_name':'Rebeccas', 'count':1, 'date':'2018-01-15 15:57:16.736741'},
    {'location_name':'Rebeccas', 'count':1, 'date':'2018-01-14 17:57:16.736741'},
    {'location_name':'Rebeccas', 'count':1, 'date':'2018-01-13 16:57:16.736741'},
    {'location_name':'Marino', 'count':1, 'date':'2018-01-11 17:57:16.736741'}
];

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
    for (var i = 0; i < 60; i++) {
      var count = Math.floor(Math.random() * 3);
      var newData = {'location_name':'Snell', 'count': count, 'date':'2018-02-01 07:' + i + ':00'};
      sampleHistoricalData.push(newData);
    }
    pg('historical_data').insert(sampleHistoricalData).then()
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
