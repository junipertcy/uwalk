var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  type: { type: String, enum: ["opinion", "user"] },
  source: { type: String, required: true }, // an openId
  target: { type: String, required: true }, // an openId
  weight: {
    agree: { type: Number, default: 0 },
    disagree: { type: Number, default: 0 },
    moderate: { type: Number, default: 0 },
    similarity: {type: Number, default: 0},
    timeSim: {type: Number, default: 0}
  },
  updatedTime: { type: Date }
});

schema.index({
  type: 1,
  source: 1,
  target: 1
},{
  unique: true
});



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
