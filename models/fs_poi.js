var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  lat: Number,
  lng: Number,
  venue_name: String,
  code: String
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};