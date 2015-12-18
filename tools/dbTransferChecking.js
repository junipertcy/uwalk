var express = require('express');

var app = module.exports = express();
var async = require('async');

app.get('/', function(req, res){
  Check.find({
  }).sort({
    _id: -1
  }).skip(60000)
  .limit(30000).exec(function(err, checkins){
    if (err){
      return res.status(400).json({});
    }

    var ii = 0;
    async.map(checkins, function(checkin, next){
      Checkin.create({
        categories: [{
          id: checkin.id,
          name: checkin.category.replace(/  +/g, ' '),
          primary: true
        }],
        location: {
          lat: checkin.lat,
          lng: checkin.lng,
          name: checkin.place_name.replace(/  +/g, ' ')
        },
        stats: {
          checkinsCount: checkin.total_checkins,
          usersCount: checkin.unique_users
        }
      }).then();
      ii++;
      console.log(ii);
      next();
    });
  }, function(){
    return res.status(200).json({
      status: 0
    });
  });
});