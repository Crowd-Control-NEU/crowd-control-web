var knex = require('./knexfile');

// setup initial table
function createDefaultTable(){

    knex.schema.withSchema('public').createTableIfNotExists('historical_data', function(table){
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
      })
}


// get current "people count" of a location
function getCountAtLocation(location_name) {
    return new Promise(async (resolve, reject) => {
        var count = knex('live_data').select('count').where('location_name', '=', location_name)
        .then()
        .catch(function(e){
            reject(e);
        })
        return resolve(count);
    });
}

// get data from last 30 days for a location
// TODO: obtain historical data for a given range, instead of only the last 30 days
function getHistoricalForLocation(location_name) {
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    return new Promise(async (resolve, reject) => {
        var historical = knex('historical_data').select()
        .where('location_name', '=', location_name)
        .andWhere('date', '>', date)
        .then()
        .catch(function(e){
            reject(e);
        })
        return resolve(historical);
    });
}

// get current list of all locations
function getLocations() {
    return new Promise(async (resolve, reject) => {
        var locations = knex('live_data').select('location_name')
        .then()
        .catch(function(e){
            reject(e);
        })
        return resolve(locations);
    });
}

function addDataEntry(location_name, count, date) {
    return new Promise(async (resolve, reject) => {
        knex('historical_data').insert({'location_name':location_name, 'count': count, 'date':date})
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
    return new Promise((resolve, reject) =>{
            var res = knex('live_data')
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
module.exports.getHistoricalForLocation = getHistoricalForLocation;
module.exports.getLocations = getLocations;
module.exports.addDataEntry = addDataEntry;
module.exports.incrementCount = incrementCount;
