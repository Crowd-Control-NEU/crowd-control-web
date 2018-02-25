const express = require('express');
const app = express();
const path = require('path');
var db = require('./models/db');
var parser = require('./models/parser');
var socketio = require('socket.io')

var bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

// Express only serves static assets in production
if (true) {
    // Serve static files from the React app
    app.use(express.static('client/build'));
  }

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = app.listen(PORT);

// Socket.io
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });


// a test api call
app.get('/api/test', (req, res) => {
    res.send({ express: 'Hello From Node.js' });
});

// get the count at a certain location (for example, /count/Marino)
app.get('/count/:location', async (req, res) => {
    var count = await db.getCountAtLocation(req.params.location).then();
    var historical = await db.getHistoricalForLocation(req.params.location).then();
    var dailyAverages = parser.getDailyAverages(historical);
    count[0]['graphData'] = dailyAverages;
    res.send(count);
});

// get the graph data  (EXAMPLE: /data/{"location":"Wollastons", "type":"daily", "startDate":"2015-01-01", "endDate":"2015-02-01"})
app.get('/data/:graph', async (req, res) => {
    var graphRequest = JSON.parse(req.params.graph)
    if(typeof graphRequest.location !== 'undefined' && typeof graphRequest.type !== 'undefined' && typeof graphRequest.startDate !== 'undefined' && typeof graphRequest.endDate !== 'undefined') {
        var historical = await db.getHistoricalGraphData(graphRequest.location, graphRequest.type, graphRequest.startDate, graphRequest.endDate);
        res.send(historical);
       }
});

// get the list of locations
app.get('/locations-list', async (req, res) => {
    var locations = await db.getLocations();
    res.send({list: locations});
});

// add a entry to the data table
app.post('/data-add', async (req, res) => {
    console.log("received /data-add POST request");
    var location_name = req.body.location_name;
    var count = req.body.count;
    var date = req.body.date;

    var locations = await db.getLocations();
    var location_is_registered = false;
    for(var i = 0; i < locations.length; i++) {
        if (locations[i].location_name == location_name) {
            location_is_registered = true;
            break;
        }
    }

    if (location_is_registered) {
        var result = await db.addDataEntry(location_name, count, date);
        io.sockets.emit('refresh', result.count);
        res.send(result);
    }
    else {
        res.send("Data Entry Refused: The location " + location_name + " is not registed.")
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../client/build/index.html'));
  });

module.exports = app;
