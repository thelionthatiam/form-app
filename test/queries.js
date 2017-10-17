const chai = require('chai');
const expect = require("chai").expect;
const chaiHTTP = require("chai-http");
const should = require("chai").should();
const server = require('../app')
const helper = require('../functions/helpers');
// const express = require('express')
// const app = express();
//
// const { databaseInformation } = require('../database-config/database-information');
// const dbMiddleware = require('../middleware/database');

chai.use(chaiHTTP);
// var server = chai.request('http://localhost.3000');
// server.use(dbMiddleware.init(databaseInformation));


var inputs = {
  email:'newbie@mailinator.com'
}


describe('This database function', function() {
  describe('selects a row from email data', function() {
    xit('and should work with a valid email', function(done) {
      chai.request(server).post('/').end(function(req, res, next) {
        req.querySvc.selectRowViaEmail(inputs, function (err, result) {
          result.should.exist();
          done();
        })
      })
    })
  })
})
