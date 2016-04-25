var models = require('require-directory')(module);
var mongoose = require('mongoose');
var lingo = require('lingo');

//statically written!!
var DB = mongoose.connect('mongodb://' + 'localhost' + '/' + 'research');
var DBAirbnb = mongoose.createConnection('mongodb://' + 'localhost' + '/' + 'research_airbnb');

var LogDB = mongoose.createConnection('mongodb://' + 'localhost' + '/' + 'construction_log');

var self = module.exports = {};

/* ICKM'16 data
*/
var airbnbSet = ["Calendar", "Full_listing", "Full_review", "Listings_w_latlng", "Nh_def", "Nh_geojson", "Simple_review"];

Object.keys(models).forEach(function(key) {
  if (key !== 'index') {
    var modelName = lingo.capitalize(key);
    if (modelName === 'Log') {
      self[modelName] = LogDB.model(modelName, models[key]);
    } else if (airbnbSet.indexOf(modelName) !== -1){
      self[modelName] = DBAirbnb.model(modelName, models[key]);
    } else {
      self[modelName] = DB.model(modelName, models[key]);
    }
  }
});

self.DB = DB;

global.mongoose = mongoose;
