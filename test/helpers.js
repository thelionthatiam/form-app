const expect = require("chai").expect;
const should = require("chai").should();
const chaiHTTP = require("chai-http");
const helper = require('../functions/helpers');

// might want to get real errors
var hasEmail = "lakjdsfgnemaildsgfd";
var hasEmailSpace = "asdkjfnae email adskjf";
var hasPhone = "alfsgjknaphone";
var hasPassword = "aeksfjnasdmfpasswordasdf"
var hasNoKeyword = "hbagjknslmfk asdfkj 13tht";
var hasTooLong = "asdg value too long value too long";
var hasNoString = 1234;
var hasKey = " key";
var hasNoKey = "adfsjhbk";

describe('this helper function', function() {
  describe('db error translator, ', function() {
    it('has email not unique', function() {
      var test = helper.dbErrTranslator(hasEmail + hasKey);
      expect(test).to.equal("The email you put in has already been used. Try again.");
    });
    it('has email invalid format', function() {
      var test = helper.dbErrTranslator(hasEmail + hasNoKey);
      expect(test).to.equal("You did not submit a valid email. Try again.");
    });
    it('has email space', function() {
      var test = helper.dbErrTranslator(hasEmailSpace + hasKey);
      expect(test ).to.equal("The email you put in has already been used. Try again.");
    });
    it('has phone not unique', function() {
      var test = helper.dbErrTranslator(hasPhone + hasKey);
      expect(test).to.equal("The phone number you put in has already been used. Try again.");
    });
    it('has phone invalid format', function() {
      var test = helper.dbErrTranslator(hasPhone + hasNoKey);
      expect(test).to.equal("You did not submit a valid phone number. Try again.");
    });
    it('has password problem', function() {
      var test = helper.dbErrTranslator(hasPassword);
      expect(test).to.equal("There was an error with your password. Contact the administrator.");
    });
    it('has a long value', function() {
      var test = helper.dbErrTranslator(hasTooLong);
      expect(test).to.equal("You typed in something over 100 characters. Keep things a shorter and try again.");
    });
    it('has some random string', function() {
      var test = helper.dbErrTranslator(hasNoKey);
      expect(test).to.equal('There was an error. Try again.');
    });
    it('has error that is not a string', function() {
      var test = helper.dbErrTranslator(hasNoString);
      expect(test).to.equal("There was an error. Try again.");
    });
  });
  describe('hashes strings ', function() {
    it('takes in a string', function(done) {
      helper.hash('string', function(err, hash) {
        expect(hash).to.be.a('string');
        done();
      });
    });
    it('takes in an int', function(done) {
      helper.hash(1234, function(err, hash) {
        should.not.exist(hash);
        done();
      });
    });
    it('takes in a robust password', function(done) {
      helper.hash("W00dhouse??", function(err, hash) {
        expect(hash).to.be.a('string');
        done();
      });
    });
  });
});
