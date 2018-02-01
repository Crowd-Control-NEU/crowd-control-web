const express = require('express');
const app = express();
var db = require('./models/db');

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
var server = app.listen(PORT);

// Socket.io
var io = require('socket.io').listen(server);

// a test api call
app.get('/api/test', (req, res) => {
    res.send({ express: 'Hello From Node.js' });
});

// get the count at a certain location (for example, /count/Marino)
app.get('/count/:location', async (req, res) => {
    var count = await db.getCountAtLocation(req.params.location).then();
    var historical = await db.getHistoricalForLocation(req.params.location).then();
    count[0]['historical'] = historical;
    res.send(count);
});

// get the list of locations
app.get('/locations-list', async (req, res) => {
    var locations = await db.getLocations().then();
    res.send({list: locations});
});

// add a entry to the data table
app.post('/data-add', async (req, res) => {
    var id = req.body.id;
    var location_name = req.body.location_name;
    var count = req.body.count;
    var date = req.body.date;
    console.log("Received: " + id, location_name, count, date);
    var result = await db.addDataEntry(id, location_name, count, date, res);
    io.sockets.emit('refresh', result.count);
    res.send(result);
});
