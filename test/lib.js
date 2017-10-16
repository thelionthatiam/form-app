const expect = require("chai").expect;
const lib = require('../functions/lib');

var currentDate = new Date();
var currentTime = currentDate.getTime();
var aMinAgo = currentTime - 60000;
var threeMinAgo = currentTime - 180000;

// output obj arguements
var passingOutputObj = {
  nonce:'a',
  thetime: aMinAgo,
};

var failingNonceOutputObj = {
  nonce:'b',
  thetime:aMinAgo,
};

var failingTimeOutputObj = {
  nonce:'a',
  thetime:threeMinAgo,
};


describe('Misc functions, ', function() {
  describe('session token validator, ', function() {
    it('compares token and time to db nonce and timestamp', function(done) {
      var passing = lib.sessionValid('a', passingOutputObj, function(bool){
        expect(bool).to.equal(true);
        done();
      });
    });
    it('compares token and time to db wrong nonce and timestamp ', function(done) {
      var failingNonce = lib.sessionValid('a', failingNonceOutputObj, function(bool){
        expect(bool).to.equal(false);
        done();
      });
    });
    it('compares token and time to db nonce and too old timestamp ', function(done) {
      var failingTime = lib.sessionValid('a', failingTimeOutputObj, function(bool){
        expect(bool).to.equal(false);
        done();
      });
    });
  });
});
