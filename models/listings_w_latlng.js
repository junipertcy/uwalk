var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  "id": Number,
  "name": String,
  "host_id": Number,
  "host_name": String,
  "neighbourhood_group": String,
  "neighbourhood": String,
  "latitude": Number,
  "longitude": Number,
  "room_type": String,
  "price": Number,
  "minimum_nights": Number,
  "number_of_reviews": Number,
  "last_review": String,
  "reviews_per_month": Number,
  "calculated_host_listings_count": Number,
  "availability_365": Number
});

schema.pre('save', function(next) {
  next();
});

if (!schema.options.toJSON) schema.options.toJSON = {};
schema.options.toJSON.transform = function (doc, ret) {
  ret.id = ret._id;
  delete ret._id;
};