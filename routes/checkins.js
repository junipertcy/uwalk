var express = require('express');
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
  var query = Checkin.find({});

  if (req.query.place){
    query.and({
      'categories.name': req.query.place
    });
  }

  if (req.query.name){
    query.and({
      'location.name': {
        $regex: req.query.name
      }
    });
  }

  Checkin.geoNear([lng, lat], {
    num: num,
    maxDistance: 10,
    spherical: true
  }, function(err, checkins){
    if (err){
      return res.status(400).json({
        msg: err
      });
    }

    return res.status(200).json({
      msgcode: 0,
      data: checkins
    });


  });
});
