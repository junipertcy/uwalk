var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  uid: String,
  venue_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Fs_poi' },
  time: String,
  offset: Number
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};