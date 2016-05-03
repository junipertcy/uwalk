var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  code: String,
  location: {
    lat: Number,
    lng: Number
  },
  features: {
    venue_type: String,
    totalCheckins: Number,
    visitPattern: String
  }
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  // ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};