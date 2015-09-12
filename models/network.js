/* refer: http://sigmajs.org/
 *
 */

var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  nodes: [{
    id: String,
    label: String,
    x: Number,
    y: Number,
    size: Number
  }],
  edges: [{
    id: String,
    source: String,
    target: String
  }]
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};
