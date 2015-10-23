/*
 * social network for event visiting logs
 */

var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  type: String,
  geometry: {
    type: String,
    coordinates: Array
  },
  center: Array,
	source: { type: String, required: true },
	target: { type: String, required: true } 
 });

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};
