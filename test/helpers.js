const expect = require("chai").expect;
const should = require("chai").should();
const chaiHTTP = require("chai-http");
const helper = require('../functions/helpers');
const supertest = require('supertest');
const sinon = require('sinon')
const hbs = require('express-handlebars')

describe('conveys database answers to the client', function() {
  it('should give me a ueful error when the error has email in it', function() {
    helpers.dbError(res, thisPage, err)
  })
})

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
        expect(hash).to.be.a('string').and.to.have.lengthOf(60);
        expect(hash).to.have.lengthOf(60);
        done();
      });
    });
    it('takes in an int', function(done) {
      helper.hash(1234, function(err, hash) {
        should.not.exist(hash);
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        done();
      });
    });
    it('takes in a robust password', function(done) {
      helper.hash("W00dhouse??", function(err, hash) {
        expect(hash).to.be.a('string').and.to.have.lengthOf(60);
        done();
      });
    });
  });
  describe('checks string for two upcase, one special, to num, three lowcase, min 8 length: ', function() {
    it('passes when all criteria are met', function() {
      var one = helper.passChecker('WW00dhouse$');
      expect(one).to.equal(true);
    });
    it('passes with minimum one special char', function() {
      var two = helper.passChecker('WW00dhouse$');
      expect(two).to.equal(true);
    })
    // is allowed without caps
    it('fails with no caps', function() {
      var three = helper.passChecker('ww00dhouse$');
      expect(three).to.equal(false);
    })
    // is allowed with no num
    it('fails with no num', function() {
      var four = helper.passChecker('ww0odhouse$');
      expect(four).to.equal(false);
    })
    it('fails wtih only lower letters', function() {
      var five = helper.passChecker('woodhouse');
      expect(five).to.equal(false);
    })
    it('fails with a length of 1', function() {
      var six = helper.passChecker('a');
      expect(six).to.equal(false);
    })
    it('fails with int', function() {
      var seven = helper.passChecker(1234);
      expect(seven).to.equal(false);
    })
    it('fails with array', function() {
      var eight = helper.passChecker(['asdf','asdf']);
      expect(eight).to.equal(false);
    })
      var nine = helper.passChecker({});
      expect(nine).to.equal(false);
    it('fails wtih undefined', function() {
      var ten = helper.passChecker(undefined);
      expect(ten).to.equal(false);
    })
  })
  // passHash -- very awk function because
  describe('hashes passwords, after passChecker, gives informative error', function() {
    it('takes in a valid password', function(done) {
      helper.passHash('WW00dhouse$', function(err){
        expect(err).to.equal(null);
        done();
      });
    });
    it('rejects an invalid password with a custom error', function(done) {
      helper.passHash('1234567890', function(err){
        expect(err).to.equal("Password must be at least 8 characters, contain two uppercase letters, three lower case letters, one of these '!@#$&*', and two digits. Try again.");
        done();
      })
    })
  })
  describe('creates a hash using bcrypt', function() {
    it('fails with takes in an int', function(done) {
      helper.hash(1234, function(err) {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        done();
      });
    });
    it('fails with takes in an object', function(done) {
      helper.hash({dog:'SirWoofers'}, function(err) {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        done();
      });
    });
  });
  // hashCheck
  describe('checks password against hashed version', function() {
    var hash = "$2a$10$xKxTSC8oqqeO9IpMMYID0.mc.mnlkRI1M9XC6k3O36SJ9.zHuioJm"
    var pass = "newbieNN11$"
    it('takes in a valid password', function(done) {
      helper.hashCheck(pass, hash, function(err, result) {
        expect(result).to.equal(true);
        done();
      });
    });
    it('takes in an invald password', function(done) {
      helper.hashCheck('anything', hash, function(err, result) {
        expect(result).to.equal(false);
        done();
      });
    });
    it('takes in a non-string', function(done) {
      helper.hashCheck([pass, 'anything'], hash, function(err, result) {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        done();
      });
    });
  });
  describe('creates random string and hashes ', function() {
    it('creates string', function(done) {
      helper.makeHashedString(function(err, hash) {
        expect(hash).to.be.a('string').and.to.have.lengthOf(60);
        expect(hash).to.have.lengthOf(60);
        done();
      });
    });
  });
});
