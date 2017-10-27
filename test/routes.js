const chai = require('chai');
const expect = require("chai").expect;
const should = require("chai").should();
const app = require('../app');
const request = require('supertest')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
  it('creates a new account', function(done) {

    request(app)
    .post('/account/create')
    .type('form')
    .send({
      'email': 'test@mailinator.com',
      'phone': '12341234',
      'password': 'nnnNN11$$'
    })
    .set('Accept', 'application/json')
    .expect(200)
    .end((err, res) => {
      if(err) throw err;
      var document = res.res.text;
      console.log(document);
      expect(document).to.match(/success/);
      done();
    })
  })
})

describe('This account route', function(){
  it('logs into an existing account', function(done) {

    request(app)
    .post('/auth/login')
    .type('form')
    .send({
      'email': 'newbie@mailinator.com',
      'password': 'nnnNN11$$'
    })
    .set('Accept', 'application/json')
    .expect(200)
    .end((err, res) => {
      if(err) throw err;
      var document = res.res.text;
      console.log(document);
      expect(document).to.match(/newbie@mailinator.com/);
      done();
    })
  })
})
