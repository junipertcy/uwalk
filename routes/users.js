var express = require('express');
var async = require('async');
var app = module.exports = express();

app.get('/', function(req, res) {

  Checkin.find({

  }).limit(1).exec(function(err, checkin){

    async.map(checkin, function(item, next){
      Fscategory.findOne({
        'name': 'Arts & Entertainment'
      }).exec(function(err, fs){
        console.log(fs.icon.prefix + fs.icon.suffix);
        next(null, fs);
      });
    }, function(err, itemArray){
      console.log(itemArray);

      res.status(200).json({
        rescode: 0,
        resmsg: 'Hello, GeoMonsters~'
      });
    });
  });
});
