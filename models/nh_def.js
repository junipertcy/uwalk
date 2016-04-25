var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  "neighbourhood_group": String,
  "neighbourhood": String
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};