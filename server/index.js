const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Hello World!");
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT);