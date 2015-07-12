var mongoose = require('mongoose');

var schema = module.exports = new mongoose.Schema({
  type: String, // Request type
  number: String, // 客户店铺ID
  contact: String, // 客户店铺联系人
  tel: String, // 客户店铺联系方式(座机)
  phone: String, //客户店铺联系方式(手机)
  location: {
    lonlat: { type: [Number], index: '2d', default: [0, 0] },
    province: String,
    city: String,
    district: String,
    address: String,
    zipcode: String //邮政编码
  },
  comment: String, //店铺备注
  tags: Array, //店铺的 tag 系统
  clients : { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  users: [{ // 可操作该店铺的账号
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedTime: { type: Date, default: Date.now }
  }],
  spots: [{
    spot: { type: mongoose.Schema.Types.ObjectId, ref: 'Spot' },
    updatedTime: { type: Date, default: Date.now }
  }],
  indexTags: [String],
  createdTime: { type: Date, default: Date.now },
  updatedTime: Date,
  isDeleted:{ type: Boolean, default:false }
},{
  versionKey: '_version'
});

schema.pre('save', function(next) {
  if (this.isNew && !this.tags) {
    this.tags = [];
  }
  this.indexTags = [];
  var self = this;
  this.tags.forEach(function(tag) {
    if (typeof tag === 'object') {
      for (var k in tag) {
        self.indexTags.push(tag[k]);
      }
      return;
    }

    self.indexTags.push(tag);
  });

  if (this.name) this.indexTags.push(this.name);
  if (this.id) this.indexTags.push(this.id);
  if (this.contact) this.indexTags.push(this.contact);
  if (this.number) this.indexTags.push(this.number);
  if (this.comment) this.indexTags.push(this.comment);
  /*
   *地理位置索引
   *
   */
  if (this.location.province) this.indexTags.push(this.location.province);
  if (this.location.city) this.indexTags.push((this.location.province ? this.location.province : '') + this.location.city);
  if (this.location.district) this.indexTags.push((this.location.city ? this.location.city : '') + this.location.district);
  if (this.location.zipcode) this.indexTags.push(this.location.zipcode);

  this.updatedTime = new Date();
  next();
});


if (!schema.options.toJSON) {
  schema.options.toJSON = {};
}
schema.options.toJSON.transform = function (doc, ret) {
  ret.createdTime = ret.createdTime && ret.createdTime.valueOf();
  ret.updatedTime = ret.updatedTime && ret.updatedTime.valueOf();
 // delete ret._id;
  delete ret.indexTags;
  delete ret.__v;
  delete ret._version;
  delete ret.isDeleted;
  delete ret.clients;
};
