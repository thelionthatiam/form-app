const chai = require('chai');
const expect = require("chai").expect;
const should = require("chai").should();
const chaiHTTP = require("chai-http");
const supertest = require('supertest');
const sinon = require('sinon');
const hbs = require('express-handlebars');


describe('This route', function(){
  xit('renders the homepage', function() {
    var spy = sinon.spy(hbs, '__express');

    supertest(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        expect(spy.calledWith(__dirname + '/views/index.hbs')).to.equal(true);

        spy.restore();
        done();
      })
  })
  xit('renders the account create page', function(done) {
    var spy = sinon.spy(hbs, '__express');

    supertest(app)
      .get('/account/to-create')
  })
})
