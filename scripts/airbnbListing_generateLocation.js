require('../env');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');

genLoc();

function genLoc(callback, count) {
  if (!count) {
    count = 0;
  }

  Full_listing.find({
    location: {
      "$exists": false
    }
  }).skip(count).limit(1000).exec(function(err, listing) {
    async.eachLimit(listing, 100, function(li, next) {
      Full_listing.update({
        _id: li._id
      }, {
        location: [li.longitude, li.latitude]
      }, function(err, updated) {
        next();
      })
    }, function(err){
      if(err) {
        return callback(err);
      }

      if (count > 118177) {
        process.exit();
      } else {
        count += 1000;
        console.log('Finished parsing ', count, ' full_listings');
        genLoc(callback, count);
      };
    });
  });
}
