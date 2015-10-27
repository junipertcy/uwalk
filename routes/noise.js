var app = module.exports = express();

app.get('/', function(req, res) {
  res.status(200).json({
    code: 0,
    msg: 'Sorry, our demo app has been temporarily moved to http://junipertcy.info/noise Please visit then.  --TC'
  });
});
