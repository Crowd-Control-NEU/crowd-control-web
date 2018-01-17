var pg = require('pg');

var conString = process.env.DB_URL || "postgres://postgres:5432@localhost/josephlally";

// setup initial table
function createDefaultTable() {
    var client = new pg.Client(conString);
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
var getCountAtLocation = function(location, res) {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('SELECT SUM(count) FROM data WHERE location_name=$1;', [location], function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            else {
                res.send(result.rows);
            }
            client.end();
        });
    });
}

module.exports.getCountAtLocation = getCountAtLocation;