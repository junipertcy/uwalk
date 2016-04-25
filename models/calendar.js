var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  "listing_id": Number,
  "date": String,
  "available": String,
  "price": String
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};