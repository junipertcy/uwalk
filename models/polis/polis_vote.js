var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  "timestamp": Number,
  "comment-id": Number,
  "voter-id": Number,
  "vote": Number
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};
