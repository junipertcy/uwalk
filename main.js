require('./env');
require('express-di');

var express = require('express');
var app = module.exports = express();
app.use(express.static('./view/noise'));

app.use(require('morgan')('dev'));

var bodyParser = require('body-parser');
app.use(require('express-json-2-csv')());




app.use(require('express-validator')({
  customValidators: {
    isArray: function(value) {
      return Array.isArray(value);
    },
    isMac: function(value) {
      return !!value && /^0117C5[0-9A-Z]{6}$/.test(value);
    },
    isValidName: function(value) {
      return !!value && value.replace(/[^\x00-\xff]/g, 'xx').length > 3 && /^[0-9a-zA-Z_\u4E00-\u9FA5]+$/.test(value);
    },
    gte: function(param, num) {
      return param >= num;
    },
    gt: function(param, num) {
      return param > num;
    },
    lte: function(param, num) {
      return param <= num;
    },
    lt: function(param, num) {
      return param < num;
    },
    ByteLenLimit: function(param, num) {
      if(!param) return true;
      var len = 0;
      for (var i = 0; i < param.length; i++) {
        var a = param.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) !== null) {
          len += 2;
        } else {
          len += 1;
        }
      }

      return len <= num;
    }
  }
}));

// Add headers
app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', req.headers.origin);

  // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');

  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers',
             'Origin, X-Requested-With, Content-Type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.header('Access-Control-Allow-Credentials', true);

  next();
});

require('./factories')(app);
require('./routes')(app);
require('./models');




app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* jshint unused:false */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log('Hello, there! You are in the development environment.');
    res.status(err.status || 500);
    res.json({
      env: 'You\'ve got an error, some features are still under development...'
    });
  });
}

app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    errcode: err.code,
    errmsg: err.message,
    error: {}
  });
});

if (app.get('env') !== 'test') {
  app.listen(process.env.PORT || 3000);
}