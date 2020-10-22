var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3001;
const { connectIoTF } = require('./config/iot');
const { connectCloudant, getAll } = require('./config/database');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

connectIoTF();

connectCloudant();

// console.log(getAll['cloudant']());

app.listen(port);
