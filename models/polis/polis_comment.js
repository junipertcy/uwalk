var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  "timestamp": Number,
  "comment-id": Number,
  "author-id": Number,
  "agrees": Number,
  "disagrees": Number,
  "moderated": Number,
  "comment-body": String,
  "usedTime": Object
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};
