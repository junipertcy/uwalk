var routes = require('require-directory')(module);
var urllib = require('urllib');

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
  app.get('/noise', function(req, res) {

    var url = 'http://junipertcy.info/acmmm-2015';
    urllib.request(url, function(err, data, response){
      console.log(err);
      console.log(data);
      console.log(response);
      res.write(data);
      res.end();
    });
  });
};
