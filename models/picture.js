var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  index: String,
  photoName: String,
  imgurl: String,
  owner: String,
  dataTaken: Date,
  timeTaken: String,
  dataUpload: Date,
  lat: Number,
  lng: Number
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};
