const express = require('express');
const app = express();
var db = require('./models/db');

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// a test api call
app.get('/api/test', (req, res) => {
    res.send({ express: 'Hello From Node.js' });
});

// get the count at a certain location (for example, /count/Marino)
app.get('/count/:location', async (req, res) => {
    var count = await db.getCountAtLocation(req.params.location, res).then();
    res.send(count);
});

// add a entry to the data table
app.post('/data-add', async (req, res) => {
    var id = req.body.id;
    var location_name = req.body.location_name;
    var count = req.body.count;
    var date = req.body.date;
    console.log("Received: " + id, location_name, count, date);
    var updatedCount = await db.addDataEntry(id, location_name, count, date, res)
    res.send(updatedCount);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT);