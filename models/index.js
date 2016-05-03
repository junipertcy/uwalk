var models = require('require-directory')(module);
var mongoose = require('mongoose');
var lingo = require('lingo');

//statically written!!
var DB = mongoose.connect('mongodb://' + 'localhost' + '/' + 'research');
var DBAirbnb = mongoose.createConnection('mongodb://' + 'localhost' + '/' + 'research_airbnb');
var DB_features = mongoose.createConnection('mongodb://' + 'localhost' + '/' + 'feature');
var DB_polis = mongoose.createConnection('mongodb://' + 'localhost' + '/' + 'polis');



var LogDB = mongoose.createConnection('mongodb://' + 'localhost' + '/' + 'construction_log');

var self = module.exports = {};

/* ICKM'16 data
*/
var airbnbSet = ["Calendar", "Full_listing", "Full_review", "Listings_w_latlng", "Nh_def", "Nh_geojson", "Simple_review", "Fs_city", "Fs_checkin", "Fs_poi"];
Object.keys(models).forEach(function(key) {
  if (key === 'features') {
    Object.keys(models[key]).forEach(function(o){
      var modelName = lingo.capitalize(o);
      self[modelName] = DB_features.model(modelName, models[key][o]);
    });
  } else if (key === 'polis') {
    Object.keys(models[key]).forEach(function(o){
      var modelName = lingo.capitalize(o);
      self[modelName] = DB_polis.model(modelName, models[key][o]);
    });
  } else if (key !== 'index') {
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
