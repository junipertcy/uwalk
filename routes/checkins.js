var express = require('express');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var app = module.exports = express();

app.get('/', function(req, res){
  if (!req.query.lat || !req.query.lng){
    return res.status(400).json({
      msg: 'latlng is required'
    });
  }

  var lat = parseFloat(req.query.lat);
  var lng = parseFloat(req.query.lng);

  var num = req.query.num | 10;
  var url;
  Checkin.geoNear([lat, lng], {
    num: num,
    maxDistance: 10000,
    spherical: true
  }, function(err, checkins){
    if (err){
      return res.status(400).json({
        msg: err
      });
    }

    async.map(checkins, function(checkin, next){
      Fscategory.find({
          $text: {
            $search: checkin.obj.categories[0].name
          }
        },{
          score: {
            $meta: 'textScore'
          }
      }).sort({
        score: {
          $meta: 'textScore'
        }
      }).exec(function(err, fsc){
      //console.log(checkin);
        if (!fsc){
          url = 'https://ss3.4sqi.net/img/categories_v2/arts_entertainment/default_44.png';
          checkin.icon = url;
          next(null, checkin);
        } else {
          fsc = fsc[0];
          url = fsc.icon.prefix + '44' + fsc.icon.suffix;
          checkin.icon = url;
          //console.log(fsc.shortName,' v.s. ',checkin.obj.categories[0].name);
          next(null,checkin);

          //console.log(fsc.shortName,' v.s. ',checkin.obj.categories[0].name);
          //console.log(url);
          //checkin.url = url;

        }

      });
    }, function(err, checkinArray){
      console.log(checkinArray);
      return res.status(200).json({
        msgcode: 0,
        data: checkinArray
      });
    });
  });
});
