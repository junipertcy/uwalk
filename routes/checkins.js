var express = require('express');
var async = require('async');
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
    num: parseFloat(num),
    maxDistance: 1000,
    spherical: true
  }, function(err, checkins){
    if (err){
      return res.status(400).json({
        msg: err
      });
    }
    var ee = [];
    checkins.forEach(function(e){
      ee.push(e.obj.stats.checkinsCount);
    });
    checkins =  _.sortBy(checkins, 'obj.stats.checkinsCount');
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
        if (fsc.length === 0){
          console.log('category icon not found, replaced by some default icons...');
          console.log(checkin.obj.categories[0].name);
          url = 'https://ss3.4sqi.net/img/categories_v2/arts_entertainment/default_bg_32.png';
          checkin.icon = url;
          next(null, checkin);
        } else {
          fsc = fsc[0];
          url = fsc.icon.prefix + 'bg_32' + fsc.icon.suffix;
          checkin.icon = url;
          next(null, checkin);
        }
      });
    }, function(err, checkinArray){
      //console.log(checkinArray);
      return res.status(200).json({
        msgcode: 0,
        data: checkinArray
      });
    });
  });
});
