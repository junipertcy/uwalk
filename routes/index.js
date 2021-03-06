var routes = require('require-directory')(module);
var public_dir = 'view/noise/';

module.exports = function(app) {
  Object.keys(routes).forEach(function(key) {
    if (key !== 'index') {
      app.use('/' + key, routes[key]);
    }
  });

  app.get('/noise', function(req, res) {
    res.sendfile(public_dir + 'index.html');
  });

  app.get('/', function(req, res) {
    res.json({ 'Urban Walkability System Version': '1.0.0' });
  });
};
