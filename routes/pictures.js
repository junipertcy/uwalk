/* Input: (lng, lat)
 * Output: [pic urls]
 */

//必須要檢查輸入，若不正確要抱錯，避免重啟
var express = require('express');

var app = module.exports = express();

app.get('/', function(req, res) {
  console.log('Hello, here\'s the pictures API!');


  if (!req.query.lat || !req.query.lng){
    return res.status(400).json({
      msg: 'latlng is required'
    });
  }
  var lat = req.query.lat;
  var lng = req.query.lng;

  console.log(typeof lng, typeof lat);

  console.log('Before finding pictures....');

  //The coordinate order is longitude, then latitude.
  Picture.geoNear([parseFloat(lng), parseFloat(lat)], {
    num: 5,
    maxDistance: 10,
    spherical: true
  }, function(err, picture){
    console.log('hello~~~~~~~');
    console.log(picture);

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
