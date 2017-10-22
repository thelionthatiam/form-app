const chai = require('chai');
const expect = require("chai").expect;
const chaiHTTP = require("chai-http");
const should = require("chai").should();
const app = require('../app')


chai.use(chaiHTTP);

var inputs = {
  email:'newbie@mailinator.com'
}

describe('This is a test of the test environment', function() {
  xit('should just say the app is running', function(done) {
    chai.request(app)
      .post('/auth/login')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      })
  })
})

describe('This database function', function() {
  describe('selects a row from email data', function() {
    xit('and works with a valid email', function(done) {
      chai.request(app)
        .post('/account/create')
        .end(function(err, response) {
          console.log('response. something', response.res);
          should.exist(response.res)
          done();
        });
    });
  });
});
