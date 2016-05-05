require('../env');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var moment = require('moment');
var fsMethods = require('../utils/foursquares');
var fsHierarchy = JSON.parse(fs.readFileSync('utils/static/foursquareHierarchy.json'));

//transferPoiData();

exports.transferPoiData = function(callback, count){
  if (!count) {
    count = 0;
  }
  Fs_poi.find({}).skip(count).limit(5000).exec(function(err, pois){
    async.mapLimit(pois, 1000, function(poi, next){
      var hierarchy = fsMethods.findVenueHierarchy(fsHierarchy.response.categories, poi.venue_name);
      hierarchy = hierarchy ? hierarchy.join(';') : 'null;' + poi.venue_name;
      Fs_checkin.find({
        venue_id: poi._id ? poi._id.toString() : next()
      }).exec(function(err, fsCheckins){
        var checkinsGroupByHour = _.groupBy(fsCheckins, function(o){
          var t = moment(new Date(o.time)).format('HH');
          return t;
        });

        var checkinsByHour = [];
        Object.keys(checkinsGroupByHour).forEach(function(o){
          checkinsByHour[Number(o)] = checkinsGroupByHour[o].length;
        });

        Fsfeature.create({
          code: poi.code,
          location: {
            lat: poi.lat,
            lng: poi.lng
          },
          features: {
            venue_type: hierarchy,
            totalCheckins: fsCheckins.length,
            visitPattern: checkinsByHour.toString()
          }
        }, function(err, fsFeature){
          next(null, fsFeature);
        });
      });

    }, function(err){
      if (err) {
        return callback(err);
      }
      count += 5000;
      console.log('Finished parsing ', count, 'pois!')
      transferPoiData(callback, count);
    });
  });
}
