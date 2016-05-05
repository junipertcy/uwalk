var express = require('express');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var app = module.exports = express();
var moment = require('moment');
var fsMethods = require('../../utils/foursquares');
var fsHierarchy = JSON.parse(fs.readFileSync('utils/static/foursquareHierarchy.json'));
var fsUtils = require('../scripts/fs2features');

app.get('/ickm16', function(req, res){
  return res.status(200).json({
    errcode: 0,
    data: "Hello there! You have successfully entered the /foursquares/ickm16 API!!"
  });
});

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

  Fs_city.findOne({
    city_name: query.market
  }, function(err, listing){
    if (err) {
      return res.status(400).json({
        errcode: '333',
        message: 'We cannot find the city you specified!'
      });
    }
    var cityCenterLat = listing.lat;
    var cityCenterLng = listing.lng;
    var cityCountryCode = listing.country_code;

    Fsfeature.find({
      code: cityCountryCode
    }).limit(10).exec(function(err, features){
      if (err) {
        return res.status(400).json({
          errcode: '333',
          message: 'We cannot find the features of the specified country code!'
        });
      }

      return res.status(200).json({
        errcode: 0,
        data: features
      });
    });
  });
});

app.get('/ickm16/trans2features', function(req, res){
  if (!req.query || req.query.secret !== "tete.is.handsome") {
    return res.status(401).json({
      errcode: "000,
      data: "wrong password!"
    });
  }
  fsUtils.transferPoiData();

  return res.status(200).json({
    errcode: 0,
    data: "Hello there! You have successfully triggered trans2features event!!"
  });
});

