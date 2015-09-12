var fixtures = require('../../load_fixtures');

describe('POST /lotteries/:id/customers/draw', function() {
  context('incorrect lottery id: ', function() {
    it('cannot find lottery', function(done) {
      http.post('/lotteries/' + lottery.id + '/customers/draw')
      .send({
        phone: customer.phone
      })
      .expect(400, function(err, result){
        result.body.should.have.property('errcode', 4011010);
        result.body.should.have.property('errmsg', 'Lottery not found.');
        done();
      });
    });
  });