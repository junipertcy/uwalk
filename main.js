require('./env');
require('express-di');
var config = require('config');

var express = require('express');
var app = module.exports = express();

app.use(require('morgan')('dev'));

var bodyParser = require('body-parser');
app.use(require('express-json-2-csv')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

require('./factories')(app);
require('./routes')(app);
require('./models');

/*
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers',
             'Origin, X-Requested-With, X-Session-ID, X-Media-Type, X-Wechat-AppID, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
*/

//app.engine('.html', require('ejs').renderFile());




app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log('Hello, there!');
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

if (app.get('env') !== 'test') {
  app.listen(process.env.PORT || 8081);
}

app.set('port', process.env.PORT || 8081);