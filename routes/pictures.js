/* Input: (lng, lat)
 * Output: [pic urls]
 */
var express = require('express');
var ul = require('urllib');
var async = require('async');
var _ = require('underscore');
var app = module.exports = express();

app.get('/', function(req, res) {
  if (!req.query.lat || !req.query.lng){
    return res.status(400).json({
      msg: 'latlng is required'
    });
  }

  var lat = parseFloat(req.query.lat);
  var lng = parseFloat(req.query.lng);


  //The coordinate order is longitude, then latitude.
  Picture.geoNear([lng, lat], {
    num: 25,
    maxDistance: 100, //meters
    spherical: true
  }, function(err, pictures){
    if (!pictures){
      return res.status(400).json({
        errcode: 1001,
        errmsg: 'No pictures found in database.'
      });
    }
    async.map(pictures, function(pic, next) {
      ul.request(pic.obj.imgurl, function(err, data, info) {
        if (err || info.status === -1) {
          next();
        } else {
          if (!!info.headers.location) {

            ul.request(info.headers.location, function(err, data, result) {
              if (result.headers.location === 'https://s.yimg.com/pw/images/en-us/photo_unavailable_l.png') {
                console.log(1);
                next();
              } else {
                console.log(2);
                next(null, info.headers.location);
              }
            });
          } else {
            next();
          }
        }
      });
    }, function(errArray, picArray) {
      picArray = _.compact(picArray);
      return res.status(200).json({
        code: 0,
        msg: picArray
      });
    });
  });
});
