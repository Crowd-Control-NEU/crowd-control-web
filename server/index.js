const express = require('express');
const app = express();

var db = require('./models/database');

// a test api call
app.get('/api/test', (req, res) => {
    res.send({ express: 'Hello From Node.js' });
});

// get the count at a certain location (for example, /count/Marino)
app.get('/count/:location', (req, res) => {
    db.getCountAtLocation(req.params.location, res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);