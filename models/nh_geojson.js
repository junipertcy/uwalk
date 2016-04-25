var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  "type": String,
  "features": [{
    "type": String,
    "geometry": {
      "type": String,
      "coordinates": [[[[Number, Number]]]]
    }
  }]
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};