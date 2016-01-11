var models = require('require-directory')(module);
var mongoose = require('mongoose');
var lingo = require('lingo');

//statically written!!
var DB = mongoose.connect('mongodb://uwalk.elasticbeanstalk.com' + '/' + 'research');
var LogDB = mongoose.createConnection('mongodb://uwalk.elasticbeanstalk.com' + '/' + 'construction_log');

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
