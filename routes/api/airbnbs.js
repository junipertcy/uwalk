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
  var query = req.query;
  if (!query.market) {
    return res.status(200).json({
      errcode: 0,
      data: "You should specify a market.  :-)"
    });
  }

  var count = Number(query.count) || 10;

  Full_listing.find({
    market: query.market
  }).limit(count).exec(function(err, listings){

    async.mapLimit(listings, 10, function(listing, next) {
      var data = {};
      data.location = {};
      data.features = {};
      data.location.lat = listing.latitude;
      data.location.lng = listing.longitude;
      data.features.property_type = listing.property_type;
      data.features.room_type = listing.room_type;
      data.features.price = (listing.price[0] === "$") ? Number(listing.price.slice(1)) : Number(listing.price);
      data.features.reviews_per_month = Number(listing.reviews_per_month);

      next(null, data);
    }, function(err, dataArray){
      if (err) {
        return res.status(401).json({
          errcode: "220",
          data: err
        });
      }
      return res.status(200).json({
        errcode: "0",
        data: dataArray
      });
    });
  });
});