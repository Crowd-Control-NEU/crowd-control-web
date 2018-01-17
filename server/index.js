const express = require('express');
const app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var db = require('./models/db');

// a test api call
app.get('/api/test', (req, res) => {
    res.send({ express: 'Hello From Node.js' });
});

// get the count at a certain location (for example, /count/Marino)
app.get('/count/:location', (req, res) => {
    db.getCountAtLocation(req.params.location, res);
});

// add a
app.post('/data-add', (req, res) => {
    var id = req.body.id;
    var location_name = req.body.location_name;
    var count = req.body.count;
    var date = req.body.date;
    console.log("Received: " + id, location_name, count, date);
    res.send("yes");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);