const express = require('express');
const app = express();

app.get('/api/test', (req, res) => {
    res.send({ express: 'Hello From Node.js' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);