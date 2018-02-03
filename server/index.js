const express = require('express');
const app = express();
const path = require('path');
var db = require('./models/db');

var bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

// Express only serves static assets in production
if (true) {
    // Serve static files from the React app
    app.use(express.static('client/build'));
  }

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = app.listen(PORT);

// Socket.io
var io = require('socket.io').listen(server);

// a test api call
app.get('/api/test', (req, res) => {
    res.send({ express: 'Hello From Node.js' });
});

// get the count at a certain location (for example, /count/Marino)
app.get('/count/:location', async (req, res) => {
    var count = await db.getCountAtLocation(req.params.location, res).then();
    res.send(count);
});

// get the list of locations
app.get('/locations-list', async (req, res) => {
    var locations = await db.getLocations().then();
    res.send({list: locations});
});

// add a entry to the data table
app.post('/data-add', async (req, res) => {
    console.log("received /data-add POST request");
    var location_name = req.body.location_name;
    var count = req.body.count;
    var date = req.body.date;
    console.log("Received: " + location_name, count, date);
    var result = await db.addDataEntry(location_name, count, date);
    io.sockets.emit('refresh', result.count);
    res.send(result);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../client/build/index.html'));
  });
  
