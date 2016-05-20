var express = require('express');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var app = module.exports = express();
var moment = require('moment');
var fsMethods = require('../../utils/foursquares');
var fsHierarchy = JSON.parse(fs.readFileSync('utils/static/foursquareHierarchy.json'));

app.get('/ickm16', function(req, res){
  return res.status(200).json({
    errcode: 0,
    data: "Hello there! You have successfully entered the /foursquares/ickm16 API!!"
  });
});

/**
* option: {type: String, enum: ["rect", "point"]} // currently only point (at city center!) is offered
*/

app.get('/ickm16/features', function(req, res){
  var earthRadius = 6371;
  var query = req.query;

  if (!query.option) {
    return res.status(200).json({
      errcode: 0,
      data: "Please specify an option of query. Either \'rect\' or \'point\'."
    });
  } else if (query.option === "rect") {
    if (!query.width || !query.height || !query.center) {
      return res.status(200).json({
        errcode: 0,
        data: "Please specify the rect\'s center (in order of lng, lat), width (unit: km), and height (unit: km)."
      });
    }

  }

  if (!query.market) {
    return res.status(200).json({
      errcode: 0,
      data: "You should specify a market.  :-)"
    });
  }
  var count = Number(query.count) || 10;

  Fs_city.findOne({
    city_name: query.market
  }, function(err, listing){
    if (err) {
      return res.status(400).json({
        errcode: '00002',
        message: 'city cannot be found error: ' + err
      });
    }

    if (query.option === "point") {
      var cityCenterLat = listing.lat;
      var cityCenterLng = listing.lng;
      var distFromCityCenter = Number(query.distFromCityCenter) || 100; //unit: kilometers
      distFromCityCenter /= earthRadius; //we need to convert the distance to radians; earch radius is approx. 6371 kilometers

      var mongoQuery = {
        "$near": [cityCenterLng, cityCenterLat],
        "$maxDistance": distFromCityCenter
      };
    } else if (query.option === "rect") {

      var rectCenter = query.center.split(',').map(Number);
      var width = Number(query.width)/earthRadius;
      var height = Number(query.height)/earthRadius;

      var coordinates = [];
      coordinates.push([ rectCenter[0] - 0.5*width, rectCenter[1] - 0.5*height ]);
      coordinates.push([ rectCenter[0] + 0.5*width, rectCenter[1] - 0.5*height ]);
      coordinates.push([ rectCenter[0] + 0.5*width, rectCenter[1] + 0.5*height ]);
      coordinates.push([ rectCenter[0] - 0.5*width, rectCenter[1] + 0.5*height ]);
      //close the polygon loop
      coordinates.push([ rectCenter[0] - 0.5*width, rectCenter[1] - 0.5*height ]);


      var mongoQuery = {
        "$geoWithin": {
           "$geometry": {
              type: "Polygon",
              coordinates: [ coordinates ]
           }
        }
      };
    }
    console.log(coordinates);
    console.log(typeof coordinates);
    console.log(mongoQuery);

    Fsfeature.find({
      location: mongoQuery
    }).limit(count).exec(function(err, features){
      if (err) {
        return res.status(400).json({
          errcode: '00001',
          message: 'feature cannot be found error: '+ err
        });
      }

      return res.status(200).json({
        errcode: 0,
        data: features
      });
    });
  });
});
