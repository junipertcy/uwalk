var express = require('express');
var async = require('async');
var fs = require('fs');
var _ = require('underscore');
var app = module.exports = express();
var fsMethods = require('../../utils/foursquares');
var fsHierarchy = JSON.parse(fs.readFileSync('utils/static/foursquareHierarchy.json'));


app.get('/ickm16', function(req, res){
  return res.status(200).json({
    errcode: 0,
    data: "Helle there! You have successfully entered the /foursquares/ickm16 API!!"
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
    "city_name": query.market
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

    Fs_poi.find({
      code: cityCountryCode
    }).limit(100).exec(function(err, pois){
      async.mapLimit(pois, 1, function(poi, next){
        var hierarchy = fsMethods.findVenueHierarchy(fsHierarchy.response.categories, poi.venue_name);

        hierarchy = hierarchy ? hierarchy.join(';') : 'null';
        next(null, hierarchy);
      }, function(err, poiArray){
        console.log(poiArray);
        return res.status(200).json({});
      });

    });
  });

});



