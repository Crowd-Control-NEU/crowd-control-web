var pg = require('pg');

var conString = process.env.DB_URL || "postgres://postgres:5432@localhost/josephlally";
var client = new pg.Client(conString);

function getRooms() {
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('SELECT * from rooms', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            console.log("hey!");
            client.end();
            return 100;
        });
    });
}

module.exports.getRooms = getRooms();