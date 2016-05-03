var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  type: { type: String, enum: ["opinion", "user"] },
  id: String,
  betweennessCentrality: { type: Number, default: 0 },
  updatedTime: { type: Date },
  layout: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  }
});

//schema.set('autoIndex', false);

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) {
  schema.options.toJSON = {};
}

schema.options.toJSON.transform = function (doc, ret) {
  delete ret.__v;
  delete ret._id;
  ret.updatedTime = ret.updatedTime && ret.updatedTime.valueOf();
};
