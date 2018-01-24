var username = require('os').userInfo().username;
var conString = process.env.DB_URL || "postgres://postgres:5432@localhost/" + username;

// setup initial table
function createDefaultTable(){
    var pg = require('knex')({
        client: 'pg',
        connection: conString,
        searchPath: ['knex', 'public']
    });
    pg.schema.withSchema('public').createTableIfNotExists('historical_data', function(table){
        table.increments('id');
        table.string('location_name', 100);
        table.integer('count');
        table.timestamp('date');
    })
    .createTableIfNotExists('live_data', function(table){
          table.increments('id');
          table.string('location_name', 100);
          table.integer('count');
     }).then().catch(function(e) {
        console.error(e);
      }).finally(function() {
        pg.destroy();
      })
}


// get current "people count" of a location
function getCountAtLocation(location_name, res) {
    var pg = require('knex')({
        client: 'pg',
        connection: conString,
        searchPath: ['knex', 'public']
    });
    console.log("location_name is ", location_name);
    return new Promise(async (resolve, reject) => {
        var count = pg('live_data').select('count').where('location_name', '=', location_name)
        .then()
        .catch(function(e){
            reject(e);
        })
        return resolve(count);
    });
}

function addDataEntry(id, location_name, count, date, res) {
    var pg = require('knex')({
        client: 'pg',
        connection: conString,
        searchPath: ['knex', 'public']
    });
    return new Promise(async (resolve, reject) => {
        pg('historical_data').insert({'id': id, 'location_name':location_name, 'count': count, 'date':date})
        .then()
        .catch(function(e){
            console.log(e);
        })
        var updatedCount = await incrementCount(location_name, count);
        return resolve({'count':updatedCount[0]});
    });
  
}

//Function arguments are location name and response
function incrementCount(location_name, count){
    var pg = require('knex')({
        client: 'pg',
        connection: conString,
        searchPath: ['knex', 'public']
    });
    return new Promise((resolve, reject) =>{
            var res = pg('live_data')
            .returning('count')
            .where('location_name', '=', location_name)
            .increment('count', count).then().catch(function(e){
                console.log(e);
            });
            return resolve(res);
   });
}

createDefaultTable();
module.exports.getCountAtLocation = getCountAtLocation;
module.exports.addDataEntry = addDataEntry;
module.exports.incrementCount = incrementCount;
