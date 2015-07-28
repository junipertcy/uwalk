var utils = require('../lib/utils');

describe('utils', function() {

  describe('.flatten()', function() {
    it('should flatten an array', function() {
      var arr = ['one', ['two', ['three', 'four'], 'five']];
      utils.flatten(arr)
        .should.eql(['one', 'two', 'three', 'four', 'five']);
    });
  });

  describe('.objectFlatten()', function() {
    it('should flatten object value to an array', function() {
      var object = {
        'one': 'two',
        'three': {
          'four': 'five'
        },
        'six': 'seven'
      };

      utils.objectFlatten(object)
        .should.eql(['two', 'five', 'seven']);
    });
  });

  describe('.purifyCSV()', function() {
    it('should purify as CSV', function() {
      var line = 'Hello, This is my fisrt "public" repository!';
      var purified = '\"Hello, This is my fisrt \"\"public\"\" repository!\"';
      utils.purifyCSV(line)
        .should.eql(purified);
    });

    it('should purify non String value', function() {
      var line = 11;
      var purified = '11';
      utils.purifyCSV(line)
        .should.eql(purified);
    });

  });

});