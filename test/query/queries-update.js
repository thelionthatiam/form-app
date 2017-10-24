const chai = require('chai');
const should = require("chai").should();
const { expect } = require("chai");
const { Query } = require('../../functions/queries');
const { pool } = require('./establish-db-connection');

var inputs = {
  email:'test@mailinator.com',
  newEmail:'newtest@mailinator.com',
  phone:'465789011',
  newPhone:'1234',
  hashedPassword:'newanything',
  user_uuid:'', // needs to be assigned from test account
  nonce:'somethingnew', // can be anything
}

var noSelector = {
  user_uuid:'bc862f48-c4a9-4c88-97c7-db8b26c2a494',
  email:'asdf@asdf.ss',
  newEmail:'newnewbie@mailinator.com',
}

var invalidUpdate = {
  nonce:null,
  email:'something',
  phone:'a',
  password:null,
}

describe('UPDATE query function', function() {
  describe('updateNonce',function(){
    it('updates with valid inputs', function(done) {
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(inputs, (err, result) => { // nested callback to get randomly genereted uuid,
        if (err) {
          console.log('test failed', err)
        } else {
          console.log(result.rows[0].user_uuid);
          inputs.user_uuid = result.rows[0].user_uuid;
          querySvc.updateNonce(inputs, (err, result) => {
            should.not.exist(err);
            done();
          })
        }
      });
    })
    it('fails when there is no selector', function(done) {
      var querySvc = new Query(pool);
      querySvc.updateNonce(noSelector, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      var querySvc = new Query(pool);
      querySvc.updateNonce(invalidUpdate, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
  })
  describe('updatePassword',function() {
    it('updates with valid inputs', function(done) {
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(inputs, (err, result) => { // nested callback to get randomly genereted uuid,
        if (err) {
          console.log('test failed', err)
        } else {
          console.log(result.rows[0].user_uuid);
          inputs.user_uuid = result.rows[0].user_uuid;
          querySvc.updatePassword(inputs, (err, result) => {
            should.not.exist(err);
            done();
          })
        }
      });
    })
    it('fails when there is no selector', function(done) {
      var querySvc = new Query(pool);
      querySvc.updatePassword(noSelector, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      var querySvc = new Query(pool);
      querySvc.updatePassword(invalidUpdate, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
  })
  describe('updatePhone',function() {
    it('updates with valid inputs', function(done) {
      var querySvc = new Query(pool);
      querySvc.updatePhone(inputs, (err, result) => {
        should.not.exist(err);
        done();
      })
    })
    it('fails when there is no selector', function(done) {
      var querySvc = new Query(pool);
      querySvc.updatePhone(noSelector, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      var querySvc = new Query(pool);
      querySvc.updateNonce(invalidUpdate, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
  })
  describe('updateEmail',function(){
    it('updates with vald inputs', function(done) {
      var querySvc = new Query(pool);
      querySvc.updateEmail(inputs, (err, result) => {
        should.not.exist(err);
        done();
      })
    })
    it('fails when there is no selector', function(done) {
      var querySvc = new Query(pool);
      querySvc.updateEmail(noSelector, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      var querySvc = new Query(pool);
      querySvc.updateEmail(invalidUpdate, (err, result) => {
        should.not.exist(err);
        should.exist(result.rows);
        should.not.exist(result.rows[0])
        done();
      })
    })
  })
})
