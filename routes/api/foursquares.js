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
* option: {type: String, enum: ["polygon", "point"]} // currently only point (at city center!) is offered
*/

app.get('/ickm16/features', function(req, res){
  var query = req.query;
  if (!query.market) {
    return res.status(200).json({
      errcode: 0,
      data: "You should specify a market.  :-)"
    });
  }
  var radiusFromCityCenter = query.radiusFromCityCenter || 10;
  var count = Number(query.count) || 10;
  var distFromCityCenter = Number(query.distFromCityCenter) || 1; //unit: kilometers
  distFromCityCenter /= 6371; //we need to convert the distance to radians; earch radius is approx. 6371 kilometers


  Fs_city.find({
    city_name: query.market
  }, function(err, listing){
    if (err) {
      return res.status(400).json({
        errcode: '333',
        message: 'city cannot be found error: ' + err
      });
    }
    var cityCenterLat = listing.lat;
    var cityCenterLng = listing.lng;

    Fsfeature.find({
      location: {
        "$geoNear": [cityCenterLng, cityCenterLat],
        "$maxDistance": distFromCityCenter
      }
    }).limit(count).exec(function(err, features){
      if (err) {
        return res.status(400).json({
          errcode: '333',
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
