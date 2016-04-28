var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  city_name: String,
  lat: Number,
  lng: Number,
  country_code: String,
  country_name: String,
  country_type: String
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};