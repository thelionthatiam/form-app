const chai = require('chai');
const should = require("chai").should();
const { expect } = require("chai");
const { Query } = require('../../functions/queries');
const { pool } = require('./establish-db-connection');

// test inputs
var inputs = {
  email:'test@mailinator.com',
  phone:'465789011',
  password:'anything',
  user_uuid:'', // needs to be assigned from test account
  nonce:'$2a$10$yMmmeaEXy0jl2BHXs/urS.aiCqcf/Ddcdy3BxpmQ7qvni1/gk4ArW', // can be anything
};

var nonExistantInputs = {
  email:'z@mailinator.com',
  phone:'465789011',
  password:'W00dhouse??',
  user_uuid:'82736ec5-fa5b-456a-b6b2-0a86555dc62a' // don't copy
};

var checkInputs = {
  email:'binator.c@',
  phone:'a',
  password:'anything',
  user_uuid:'somethingwrong'
};

var wrongTypeInputs = {
  email: 1234,
  phone: 1234,
  password:{qwer:1234},
  user_uuid:[2]
};


describe('SELECT query function', function() {
  describe('selectRowViaEmail', function() {
    it('gets a row with valid input', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(inputs, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows[0]);
        expect(result.rows[0].phone).to.equal('465789011');
        done();
      })
    })
    it('fails with nonExistantInputs', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(nonExistantInputs, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
    it('fails with checkInputs', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(checkInputs, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
    it('fails with wrongTypeInputs', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(wrongTypeInputs, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
  })
  describe('selectNonceAndTimeViaUID', function() {
    it('gets a row with valid input', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(inputs, (err, result) => { // nested callback to get randomly genereted uuid,
        if (err) {
          console.log('test failed', err)
        } else {
          console.log(result.rows[0].user_uuid);
          inputs.user_uuid = result.rows[0].user_uuid;
          querySvc.selectNonceAndTimeViaUID(inputs, (err, result) => {
            should.not.exist(err);
            should.exist(result.rows[0]);
            expect(result.rows[0].nonce).to.equal('$2a$10$yMmmeaEXy0jl2BHXs/urS.aiCqcf/Ddcdy3BxpmQ7qvni1/gk4ArW');
            done();
          })
        }
      });
    })
    it('fails with nonExistantInputs', function(done){

    var querySvc = new Query(pool);
      querySvc.selectNonceAndTimeViaUID(nonExistantInputs, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
    it('fails with checkInputs', function(done){

    var querySvc = new Query(pool);
      querySvc.selectNonceAndTimeViaUID(checkInputs, (err, result) => {
        should.exist(err);
        should.not.exist(result);
        err.should.be.an.instanceOf(Error);
        done();
      })
    })
    it('fails with wrongTypeInputs', function(done){

    var querySvc = new Query(pool);
      querySvc.selectNonceAndTimeViaUID(wrongTypeInputs, (err, result) => {
        should.exist(err);
        should.not.exist(result);
        err.should.be.an.instanceOf(Error);
        done();
      })
    })
  })
})
