var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  "listing_id": Number,
  "id": Number,
  "date": String,
  "reviewer_id": Number,
  "reviewer_name": String,
  "comments": String
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};