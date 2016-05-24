var express = require('express');
var async = require('async');
var _ = require('underscore');
var app = module.exports = express();

app.get('/ickm16', function(req, res){
  return res.status(200).json({
    errcode: 0,
    data: "Helle there! You have successfully entered the /airbnbs/ickm16 API!!"
  });
});

app.get('/ickm16/features', function(req, res){
  var earthRadius = 6371.1;
  var magicNumber = 111.111;

  var query = req.query;

  if (!query.option) {
    return res.status(200).json({
      errcode: 0,
      data: "Please specify an option of query. Either \'rect\' or \'cityCenter\'."
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

  var count;
  if (query.count === "all") {
    count = 10000000;
  } else {
    count = Number(query.count) || 10;
  }

  var bnbFeature = function (query, count, callback) {
    Full_listing.find({
      location: query
    }, {
      _id: 0,
      location: 1,
      property_type: 1,
      room_type: 1,
      price: 1,
      reviews_per_month: 1
    }).limit(count).exec(function(err, listings){
      async.mapLimit(listings, 10, function(listing, next) {
        var data = {};
        data.location = listing.location;
        data.features = {};
        data.features.property_type = listing.property_type;
        data.features.room_type = listing.room_type;
        data.features.price = (listing.price[0] === "$") ? Number(listing.price.slice(1)) : Number(listing.price);
        data.features.reviews_per_month = Number(listing.reviews_per_month);

        next(null, data);
      }, function(err, dataArray){
        if (err) {
          callback(err);
        }
        callback(null, dataArray);
      });
    });
  }

  Fs_city.findOne({
    city_name: query.market
  }, function(err, listing){
    if (err) {
      return res.status(400).json({
        errcode: '00343',
        message: 'city cannot be found: ' + err
      });
    }
    var cityCenterLat = listing.lat;
    var cityCenterLng = listing.lng;

    if (query.option === "cityCenter") {
      var distFromCityCenter = Number(query.distFromCityCenter) || 100; //unit: kilometers
      distFromCityCenter /= earthRadius; //we need to convert the distance to radians; earch radius is approx. 6371.1 kilometers

      var mongoQuery = {
        "$near": [cityCenterLng, cityCenterLat],
        "$maxDistance": distFromCityCenter //radians!
      };
    } else if (query.option === "rect") {
      //in the future, it should wrap into a function; not useful when near the poles or the requested area is large
      var rectCenter = query.center.split(',').map(Number);

      var width = Number(query.width)/magicNumber*Math.cos(cityCenterLat/360*2*Math.PI);
      var height = Number(query.height)/magicNumber;

      var coordinates = [];
      coordinates.push([ rectCenter[0] - 0.5*width, rectCenter[1] - 0.5*height ]); //bottom left coordinates
      coordinates.push([ rectCenter[0] + 0.5*width, rectCenter[1] + 0.5*height ]); //upper right coordinates

      var mongoQuery = {
        "$geoWithin": {
           "$box": coordinates
        }
      };
    }

    bnbFeature(mongoQuery, count, function(err, features) {
      if (err) {
        return res.status(400).json({
          errcode: '00032',
          message: 'features cannot be found error: ' + err
        });
      }

      return res.status(200).json({
        errcode: 0,
        data: features
      });
    });
  });
});