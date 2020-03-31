const express = require('express');
const { createServer } = require('http');

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send("Working!"))

app.listen(port, () => console.log("Listening"));
