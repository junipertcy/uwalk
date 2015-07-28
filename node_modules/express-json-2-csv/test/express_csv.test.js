var express = require('express');
var app = express();
app.use(require('..')());

var supertest = require('supertest');
var request = supertest(app);

app.get('/test/1', function(req, res) {
  res.csv([
    ['a', 'b', 'c'],
    ['d', 'e', 'f']
  ]);
});

app.get('/test/2', function(req, res) {
  res.csv([
    [ 'a', 'b', null, 'c' ]
  ]);
});

app.get('/test/3', function(req, res) {
  res.csv([
    [ 'a', 'b', undefined, 'c' ]
  ]);
});

app.get('/test/objectArray', function(req, res) {
  res.csv([
    { 
      stringProp: 'a', 
      nullProp: null, 
      undefinedProp: undefined , 
      objectProp: { 
        objectPropChild: 'b',
        objectPropChildString: 'Hello, L"i"sa'
      }
    },
    { 
      stringProp: 'c',
      nullProp: null,
      undefinedProp: undefined 
    }
  ]);
});

describe('express-csv', function() {

  it('should response valid content-type', function(done) {
    request.get('/test/1')
    .expect(200, function(err, result) {
      result.headers['content-type'].should.match(/^text\/csv/);
      done();
    });
  });

  it('should response csv', function(done) {
    request.get('/test/1')
    .expect(200, function(err, result) {
      result.text.should.equal('a,b,c\r\nd,e,f\r\n');
      done();
    });
  });


  it('should response csv includes ignored null', function(done) {
    request.get('/test/2')
    .expect(200, function(err, result) {
      result.text.should.equal('a,b,,c\r\n');
      done();
    });
  });

  it('should response csv includes ignored undefined', function(done) {
    request.get('/test/3')
    .expect(200, function(err, result) {
      result.text.should.equal('a,b,,c\r\n');
      done();
    });
  });

  describe('when given an array of objects', function() {
    it('should response purified line', function(done) {
      request.get('/test/objectArray')
      .expect(200, function(err, result) {
        result.text.should.equal('a,,,b,\"Hello, L\"\"i\"\"sa\"\r\nc,,\r\n');
        done();
      });
  });
  });

});
