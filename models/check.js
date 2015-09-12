var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  id: Number,
  lat: Number,
  lng: Number,
  category: String,
  unique_users: Number,
  total_checkins: Number,
  place_name: String
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};
