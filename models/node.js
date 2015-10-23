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
	id: { type: String, required: true },
  size: Number, //visits
  label: String,
  x: Number,
  y: Number
 });

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};