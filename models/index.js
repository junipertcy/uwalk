var models = require('node-require-directory')(__dirname);
var mongoose = require('mongoose');
var lingo = require('lingo');
var config = require('config');

var DB = mongoose.connect('mongodb://' + config.mongodb.host + '/' + config.mongodb.database);
var LogDB = mongoose.createConnection('mongodb://' + config.logMongodb.host + '/' + config.logMongodb.database);

var self = module.exports = {};


Object.keys(models).forEach(function(key) {
  if (key !== 'index') {
    var modelName = lingo.capitalize(key);
    if (modelName === 'Log') {
      self[modelName] = LogDB.model(modelName, models[key]);
    } else {
      self[modelName] = DB.model(modelName, models[key]);
    }
  }
});

self.DB = DB;

global.mongoose = mongoose;
