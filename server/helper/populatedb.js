var pg = require('pg');
var format = require('pg-format');
var username = require('os').userInfo().username;

var conString = process.env.DB_URL || "postgres://postgres:5432@localhost/" + username;
var client = new pg.Client(conString);
var client2 = new pg.Client(conString);

var values = [
    [ 1, 'Rebeccas', 1, '2018-01-16 15:57:16.736741'],
    [ 2, 'Rebeccas', 1, '2018-01-15 15:57:16.736741'],
    [ 3, 'Rebeccas', 1, '2018-01-14 17:57:16.736741'],
    [ 4, 'Rebeccas', 1, '2018-01-13 16:57:16.736741'],
    [ 5, 'Marino', 1, '2018-01-11 17:57:16.736741']
];

// clear the database of any existing rows
function clearTable() {
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('DELETE FROM data;', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

// populate the database
function populatedb() {
    query = format('INSERT INTO data (id, location_name, count, date) VALUES %L', values);
    // INSERT INTO test_table (id, name) VALUES ('1', 'jack'), ('2', 'john'), ('3', 'jill')
    query = query + ';';
    console.log(query);

    client2.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client2.query(query, function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client2.end();
        });
    });
}


clearTable();
setTimeout(populatedb, 5000)
