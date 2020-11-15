const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const app = express()
app.use(bodyParser.json());
app.use(cors());

app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(5000)