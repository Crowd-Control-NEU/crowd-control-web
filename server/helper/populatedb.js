var db = require('../models/db')
var pg = require('pg');
var format = require('pg-format');
var username = require('os').userInfo().username;

var conString = process.env.DB_URL || "postgres://postgres:5432@localhost/" + username;
var client = new pg.Client(conString);

var sampleHistoricalData = [
    [ 1, 'Rebeccas', 1, '2018-01-16 15:57:16.736741'],
    [ 2, 'Rebeccas', 1, '2018-01-15 15:57:16.736741'],
    [ 3, 'Rebeccas', 1, '2018-01-14 17:57:16.736741'],
    [ 4, 'Rebeccas', 1, '2018-01-13 16:57:16.736741'],
    [ 5, 'Marino', 1, '2018-01-11 17:57:16.736741']
];

var sampleLiveData = [
    [1, 'Rebeccas', 25],
    [2, 'Curry Student Center', 100]
];

// clear the database of any existing rows
function clearTable() {
    client.query('DELETE FROM historical_data', function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
    });
    client.query('DELETE FROM live_data', function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
    });
}

// populate the database
function populateHistoricalData() {
    query = format('INSERT INTO historical_data (id, location_name, count, date) VALUES %L', sampleHistoricalData);
    // INSERT INTO test_table (id, name) VALUES ('1', 'jack'), ('2', 'john'), ('3', 'jill')
    query = query + ';';
    console.log(query);
    client.query(query, function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        client.end();
    });
}
function populateLiveData() {
    query = format('INSERT INTO live_data (location_id, location_name, count) VALUES %L', sampleLiveData);
    // INSERT INTO test_table (id, name) VALUES ('1', 'jack'), ('2', 'john'), ('3', 'jill')
    query = query + ';';
    console.log(query);

    client.query(query, function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        client.end();
    });
}
function populatedb() {
    populateHistoricalData();
    populateLiveData();
}


clearTable();
setTimeout(populatedb, 5000)
