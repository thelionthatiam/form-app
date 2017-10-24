const chai = require('chai');
const should = require("chai").should();
const { expect } = require("chai");
const { Query } = require('../../functions/queries');
const { pool } = require('./establish-db-connection');

var inputs = {
  email:'test@mailinator.com',
  phone:'465789011',
  password:'anything',
  user_uuid:'', // needs to be assigned from test account
  nonce:'$2a$10$yMmmeaEXy0jl2BHXs/urS.aiCqcf/Ddcdy3BxpmQ7qvni1/gk4ArW', // can be anything
};

var checkInputsEmail = {
  email:'binator.c@',
  phone:'1',
  password:"anything"
};

var checkInputsPhone = {
  email:'asdf@mailinator.com',
  phone:'a',
  password:'anything',
}

var checkInputsPassword = {
  email:'asdf@mailinator.com',
  phone:'1',
  password:null,
}

var wrongTypeInputs = {
  email: 1234,
  phone: 1234,
  password:{qwer:1234},
};

describe('INESRT query function', function() {
  describe('insertNewUser', function() {
    it('creates with valid inputs', function(done){  // can only run once
      var querySvc = new Query(pool);
      querySvc.insertNewUser(inputs, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows[0]);
        expect(result.rows[0].email).to.equal('test@mailinator.com');
        done();
      })
    })
    it('fails with pre-existing inputs', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(inputs, (err, result) => {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        expect(err).to.match(/duplicate/g)
        done();
      })
    })
    it('fails with checkInputsEmail', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(checkInputsEmail, (err, result) => {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        expect(err).to.match(/email/g)
        done();
      })
    })
    it('fails with checkInputsPhone', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(checkInputsPhone, (err, result) => {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        expect(err).to.match(/phone/g)
        done();
      })
    })
    it('fails with checkInputsPassword', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(checkInputsPassword, (err, result) => {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        expect(err).to.match(/password/g)
        done();
      })
    })
    it('fails with wrongTypeInputs', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(wrongTypeInputs, (err, result) => {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        done();
      })
    })
  })

  describe('insertNewNonce', function() {
    it('creates with valid inputs', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(inputs, (err, result) => { // nested callback to get randomly genereted uuid,
        if (err) {
          console.log('test failed', err)
        } else {
          console.log(result.rows[0].user_uuid);
          inputs.user_uuid = result.rows[0].user_uuid;

          querySvc.insertNewNonce(inputs, (err, result) => {
            should.not.exist(err);
            should.exist(result.rows[0]);
            expect(result.rows[0].user_uuid).to.equal(inputs.user_uuid);
            done();
          })
        }
      });
    })
    it('fails with pre-existing inputs', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewNonce(inputs, (err, result) => {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        expect(err).to.match(/duplicate/g)
        done();
      })
    })
    it('fails with null nonce', function(done){
      var querySvc = new Query(pool);
      inputs.nonce = null; // update nonce to be null

      querySvc.insertNewNonce(inputs, (err, result) => {
        should.exist(err);
        err.should.be.an.instanceOf(Error);
        expect(err).to.match(/null/g)
        done();
      })
    })
  })
})
