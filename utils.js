var randomString = exports.randomString = function (length, space) {
  var text = '';
  for (var i = 0; i < length; ++i) {
    text += space.charAt(Math.floor(Math.random() * space.length));
  }
  return text;
};

randomString.LETTER_NUMBER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
randomString.HEX = '1234567890ABCDEF';
randomString.NUMBER = '1234567890';

exports.paddingLeft = function (str, c, n) {
  if (! str || ! c || str.length >= n) {
    return str;
  }

  var max = (n - str.length) / c.length;
  for (var i = 0; i < max; i++) {
    str = c + str;
  }

  return str;
};

// var nodemailer = require("nodemailer");  
// exports.sendEmail = function(opt,callback){
//   // 开启一个 SMTP 连接池
//   var smtpTransport = nodemailer.createTransport({
//     host: "hwsmtp.exmail.qq.com", // 主机
//     secureConnection: true, // 使用 SSL
//     port: 25, // SMTP 端口
//     auth: {
//       user: "jing@sensoro.com", // 账号
//       pass: "wsj101120" // 密码
//     }
//   });
//   // 设置邮件内容
//   var mailOptions = {
//     from: "jing@sensoro.com", // 发件地址
//     to: opt.emailList, // 收件列表
//     subject: opt.subject, // 标题
//     html: opt.html // html 内容
//   };
//   // 发送邮件
//   smtpTransport.sendMail(mailOptions, function (error, response) {
//     callback(err,response);
//     smtpTransport.close(); // 关闭连接池
//   });
// }
