var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  "n-votes": Number,
  "n-comments": Number,
  "n-visitors": Number,
  "n-voters": Number,
  "n-commenters": Number
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};
