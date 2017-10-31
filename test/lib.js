const chai = require('chai');
const expect = require("chai").expect;
const chaiHTTP = require("chai-http");
const should = require("chai").should();
const lib = require('../functions/lib');
const nodeMailer = require('nodemailer');
const mailConfig = require('../gen-config/mail-config');

// sessionValid time vars 
var currentDate = new Date();
var currentTime = currentDate.getTime();
var aMinAgo = currentTime - 60000;
var threeMinAgo = currentTime - 180000;

// sessionValid test objects
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
    it('compares token and time to db wrong nonce and timestamp', function(done) {
      var failingNonce = lib.sessionValid('a', failingNonceOutputObj, function(bool){
        expect(bool).to.equal(false);
        done();
      });
    });
    it('compares token and time to db nonce and too old timestamp', function(done) {
      var failingTime = lib.sessionValid('a', failingTimeOutputObj, function(bool){
        expect(bool).to.equal(false);
        done();
      });
    });
  });
});

// sendMail testObjects

var mailOptionsValid = {
  from: 'juliantheberge@gmail.com',
  to: 'thisisavalidmail@mailinator.com',
  subject: 'Password reset from form app',
  text: "http://localhost:3000/auth/new-password"
};

var mailOptionsString = {
  from: 'juliantheberge@gmail.com',
  to: 'thisisjustastring',
  subject: 'Password reset from form app',
  text: "http://localhost:3000/auth/new-password"
};

var mailOptionsNumber = {
  from: 'juliantheberge@gmail.com',
  to: 1234,
  subject: 'Password reset from form app',
  text: "http://localhost:3000/auth/new-password"
};


describe('Misc functions, ', function() {
  describe('mail sender, ', function() {
    it('takes an email address and returns response information', function(done) {
      this.timeout(5000);
      lib.sendMail(mailOptionsValid, mailConfig.transporter, function(error, info){
        info.should.exist;
        done();
      });
    });
    it('takes non-email string and returns an error', function(done) {
      this.timeout(5000);
      lib.sendMail(mailOptionsString, mailConfig.transporter, function(error, info){
        should.exist(error);
        error.should.be.an.instanceOf(Error);
        done();
      });
    });
    it('takes in a non-string and returns an error', function(done) {
      this.timeout(5000);
      lib.sendMail(mailOptionsNumber, mailConfig.transporter, function(error, info){
        should.exist(error);
        error.should.be.an.instanceOf(Error);
        done();
      });
    });
  });
});
