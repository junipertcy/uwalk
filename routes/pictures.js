/* Input: (lng, lat)
 * Output: [pic urls]
 */
var express = require('express');
var ul = require('urllib');
var async = require('async');
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
    num: 20,
    maxDistance: 100, //meters
    spherical: true
  }, function(err, picture){
    if (!picture){
      return res.status(400).json({
        errcode: 1001,
        errmsg: 'No pictures found in database.'
      });
    }

    var urlArray = [];
    async.map(picture, function(pic, next) {
      ul.request(e.obj.imgurl, function(err, data, info) {
        if (err) {
          next(err);
        }
        ul.request(info.headers.location, function(err, data, info) {
          if (err) {
            next(err);
          }

          if (info.headers.location === 'https://s.yimg.com/pw/images/en-us/photo_unavailable_l.png') {
            next();
          } else {
            next(null, info.headers.location);
          }
        });
      });
    }, function(errArray, picArray) {
      if (errArray) {

      }
      return res.status(200).json({
        code: 0,
        msg: picArray
      });
    });
  });
});
