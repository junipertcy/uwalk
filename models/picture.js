var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  imgurl: String,
  loc: {
    type: String,
    coordinates: { type: [Number], index: '2d'}
  }
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};
