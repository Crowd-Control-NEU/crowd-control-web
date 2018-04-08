var knex = require('./knexfile');
var moment = require('moment');
const { Client } = require('pg')

var username = require('os').userInfo().username;
var conString = process.env.DB_URL || "postgres://postgres:5432@localhost/" + username;

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

async function getHistoricalGraphData(location, type, startDate, endDate) {
    console.log("Received request of graph data for " + location + " with " + type + " granularity from " + startDate + " to " + endDate);

    if (type == "daily") {
        return await getHistoricalGraphDataDaily2(location, startDate, endDate);
    }

    if (type == "weekly") {
        return getHistoricalGraphDataWeekly(location, startDate, endDate);
    }

    if (type == "monthly") {
        return getHistoricalGraphDataMonthly(location, startDate, endDate);
    }

    if (type == "yearly") {
        return getHistoricalGraphDataYearly(location, startDate, endDate);
    }
}

function getHistoricalGraphDataDaily(location, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        var historical = knex('historical_data').select()
        .where('location_name', '=', location)
        .andWhere('date', '>', startDate)
        .andWhere('date', '<', endDate)
        .then(function(historical) {
            var data = []
            for (var i = 0; i<historical.length; i++) {
                data.push({"date": historical[i]['date'], "count": historical[i]['count'] })
            }
            resolve(data)
        })
        .catch(function(e){
            reject(e);
            console.log(e);
        })
    }); 
}

function getHistoricalGraphDataDaily2(location, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        const client = new Client(conString)
        client.connect() 
        var queryWeek = 'SELECT date_trunc($1, date) AS "Day" , sum(count) AS "visitors" FROM historical_data WHERE location_name = $2 and date > $3 and date < $4 and count > 0 GROUP BY 1 ORDER BY 1;'
        const res = await client.query(queryWeek, ['day', location, startDate, endDate])
        console.log(res.rows)
        resolve(res.rows)
        await client.end()
    }); 
}

function getHistoricalGraphDataWeekly(location, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        const client = new Client(conString)
        client.connect() 
        var queryWeek = 'SELECT date_trunc($1, date) AS "Week" , sum(count) AS "visitors" FROM historical_data WHERE location_name = $2 and date > $3 and date < $4 and count > 0 GROUP BY 1 ORDER BY 1;'
        const res = await client.query(queryWeek, ['week', location, startDate, endDate])
        console.log(res.rows)
        resolve(res.rows)
        await client.end()
    }); 
}

function getHistoricalGraphDataMonthly(location, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        const client = new Client(conString)
        client.connect() 
        var queryMonth = 'SELECT date_trunc($1, date) AS "Month" , sum(count) AS "visitors" FROM historical_data WHERE location_name = $2 and date > $3 and date < $4 and count > 0 GROUP BY 1 ORDER BY 1;'
        const res = await client.query(queryMonth, ['month', location, startDate, endDate])
        console.log(res.rows)
        resolve(res.rows)
        await client.end()
    }); 
}

function getHistoricalGraphDataYearly(location, startDate, endDate) {
    return new Promise(async (resolve, reject) => {
        const client = new Client(conString)
        client.connect() 
        var queryYear = 'SELECT date_trunc($1, date) AS "Year" , sum(count) AS "visitors" FROM historical_data WHERE location_name = $2 and date > $3 and date < $4 and count > 0 GROUP BY 1 ORDER BY 1;'
        const res = await client.query(queryYear, ['year', location, startDate, endDate])
        console.log(res.rows)
        resolve(res.rows)
        await client.end()
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
module.exports.getHistoricalGraphData = getHistoricalGraphData;
module.exports.getLocations = getLocations;
module.exports.addDataEntry = addDataEntry;
module.exports.incrementCount = incrementCount;