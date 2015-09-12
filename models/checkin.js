var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  categories: [{
    icon: String,
    id: String,
    name: { type: String, required: true },
    primary: Boolean
  }],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: String
  },
  stats: {
    checkinsCount: { type: Number, default: 0 },
    usersCount: { type: Number, default: 0 }
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
