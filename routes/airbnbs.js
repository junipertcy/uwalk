var express = require('express');
var async = require('async');
var _ = require('underscore');
var app = module.exports = express();

app.get('/ickm16', function(req, res){
  var query = req.query;

  if (!query.market) {
    return res.status(200).json({
      errcode: 0,
      data: "You should specify a market.  :-)"
    });
  }

  Full_listing.findOne({
    "market": query.market
  }, function(err, listing){
    return res.status(200).json({
      errcode: 0,
      data: listing
    });


  });
});