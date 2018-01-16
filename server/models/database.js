var pg = require('pg');

var conString = process.env.DB_URL || "postgres://postgres:5432@localhost/josephlally";
var client = new pg.Client(conString);

// setup initial table
function createDefaultTable() {
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('CREATE TABLE IF NOT EXISTS data (id integer NOT NULL, location_name varchar(100), count integer, date TIMESTAMP); ', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            client.end();
        });
    });
}

// get current "people count" of a location
function getCount(location) {
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('SELECT * FROM data WHERE location_name=$1;', [location], function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            for (var i = 0; i < result.rows.length; i++) {
                console.log(JSON.stringify(result.rows[i]))
            }
            client.end();
        });
    });
}