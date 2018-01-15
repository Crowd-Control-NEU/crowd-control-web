const express = require('express');
const app = express();
const { Client } = require('pg');

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


// connecting to DB
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  
  client.connect();
  
  client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  });