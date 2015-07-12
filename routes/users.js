var express = require('express');

var app = module.exports = express();

app.get('/', function(req, res) {
  res.status(200).json({
    rescode: 0,
    resmsg: 'Hello, GeoMonsters~'
  });
});
