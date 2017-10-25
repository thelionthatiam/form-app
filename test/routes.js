const chai = require('chai');
const expect = require("chai").expect;
const should = require("chai").should();
const chaiHTTP = require("chai-http");
const app = require('../app');
const request = require('supertest')

// chai.use(require('chai-dom'))
// const sinon = require('sinon');
// const hbs = require('express-handlebars');
var inputs = {}

describe('This index route', function(){
  it('renders the homepage', function(done) {
    request(app)
    .get('/')
    .end((err, res) => {
      var document = res.res.text;
      expect(res.statusCode).to.equal(200);
      expect(document).to.match(/Put all your cares aside!/);
      done();
    })
  })
})

describe('This account route', function(){
  it('creates an account', function(done) {

    request(app)
    .post('/account/create')
    .send({
      req.body.email = 'test@mailinator.com';
      req.body.phone = '465789011';
      req.body.password = 'testTEST11$$';
    })
    .end((err, res) => {
      var document = res.res.text;
      console.log(document)
      expect(res.statusCode).to.equal(200);
      expect(document).to.match(/success/);
      done();
    })
  })
})


// res req ClientRequest res IncomingMessage text
// inputs = {
//   email:'test@mailinator.com',
//   phone:'465789011',
//   password:'testTEST11$$',
