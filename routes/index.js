var routes = require('require-directory')(module);
var fs = require('fs');
var html = fs.readFileSync('view/noise/index.html');

module.exports = function(app) {
  Object.keys(routes).forEach(function(key) {
    if (key !== 'index') {
      app.use('/' + key, routes[key]);
    }
  });

  app.get('/', function(req, res) {
    res.json({ 'Urban Walkability System Version': '0.0.1' });
  });

  //acmmm-2015: NYC Grand Challenge
  app.get('/view/noise', function(req, res) {
    res.writeHead(200);
    res.write(html);
    res.end();
  });

};
