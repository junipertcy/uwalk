/* Input: (lng, lat)
 * Output: [pic urls]
 */
var express = require('express');

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
    num: 10,
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
    picture.forEach(function(e){
      urlArray.push(e.obj.imgurl);
    });

    if (err){
      return res.status(400).json({
        errcode: '',
        errmsg: err
      });
    }

    return res.status(200).json({
      code: 0,
      msg: urlArray
    });
  });
});
