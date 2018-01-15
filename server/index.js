const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Crowd Control Homepage");
});

app.get('/About', (req, res) => {
    res.send("This is the about page");
});

app.get('/Room1', (req, res) => {
    res.send("This is the page to show details for ROOM 1!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);