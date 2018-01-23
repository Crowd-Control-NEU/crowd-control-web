var pg = require('pg');
var username = require('os').userInfo().username;

var conString = process.env.DB_URL || "postgres://postgres:5432@localhost/" + username;

// setup initial table
function createDefaultTable() {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var historyTableQuery = 'CREATE TABLE IF NOT EXISTS historical_data (id integer NOT NULL,\
                                    location_name varchar(100), count integer, date TIMESTAMP);';
        var liveDataTableQuery = 'CREATE TABLE IF NOT EXISTS live_data (location_id integer NOT NULL,\
                                    location_name varchar(100), count integer);';
        client.query(historyTableQuery, function(err, result) {
            if(err) {
                return console.error('error running query', err);
                }
            });
        client.query(liveDataTableQuery, function(err, result){
            if (err){
                return console.error('error running query' , err);
            }
            client.end();
        });
    });
}

// get current "people count" of a location
function getCountAtLocation(location, res) {
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

function addDataEntry(id, location_name, count, date, res) {
    return new Promise(async (resolve, reject) => {
        var client = new pg.Client(conString);
        client.connect(function(err) {
            if(err) {
                return console.error('could not connect to postgres', err);
            }
            client.query('INSERT INTO historical_data (id, location_name, count, date) VALUES ($1, $2, $3, $4)', [id, location_name, count, date], function(err, result) {
                if(err) {
                    return console.error('error running query', err);
                }
                else {
                    res.send("added entry to data table");
                }
                client.end();
            });
        });
        var updatedCount = await incrementCount(location_name, count);
        return resolve(updatedCount);
    });
  
}

//Function arguments are location name and response
function incrementCount(location_name, count){
    incrementQuery = "UPDATE live_data SET count = count +" + count + "WHERE location_name=" +"'" + location_name + "'"; 
    return new Promise((resolve, reject) =>{
            var client = new pg.Client(conString);
            client.connect(function(err){
                if(err){
                    return reject(err);
                }
                //increments count on location
                client.query(incrementQuery, function(err,result){
                    if(err){
                        return reject(err);
                    }
            });
            client.query("SELECT count FROM live_data WHERE location_name=" +"'" + location_name + "'", function(err,result){
                if(err){
                    return reject(err);
                }
                else{
                    console.log('going to return result');
                    return resolve(result.rows[0]);
                }
                client.end();
            });
            })
   });
}

createDefaultTable();
module.exports.getCountAtLocation = getCountAtLocation;
module.exports.addDataEntry = addDataEntry;
module.exports.incrementCount = incrementCount;
