const chai = require('chai');
const expect = require("chai").expect;
const should = require("chai").should();
const db = require('../database-config/database-information');
const { Query } = require('../functions/queries');
const { Pool } = require('pg');
const pool = new Pool(db.databaseInformation);

describe('INESRT query function', function() {
  // test inputs
  var happyInputs = {
    email:'b@mailinator.com',
    phone:'465789011',
    password:'anything',
    user_uuid:'873bfe0b-58d8-45d5-b599-55848d3edfa1',
    nonce:'$2a$10$yMmmeaEXy0jl2BHXs/urS.aiCqcf/Ddcdy3BxpmQ7qvni1/gk4ArW',
  };

  var alreadyExistInputs = {
    email:'newbie@mailinator.com',
    phone:'1',
    password:'$2a$10$xKxTSC8oqqeO9IpMMYID0.mc.mnlkRI1M9XC6k3O36SJ9.zHuioJm',
    user_uuid:'873bfe0b-58d8-45d5-b599-55848d3edfa1',
    nonce:'$2a$10$yMmmeaEXy0jl2BHXs/urS.aiCqcf/Ddcdy3BxpmQ7qvni1/gk4ArW',
  };

  var nullNonce = {
    email:'newbie@mailinator.com',
    phone:'1',
    password:'$2a$10$xKxTSC8oqqeO9IpMMYID0.mc.mnlkRI1M9XC6k3O36SJ9.zHuioJm',
    user_uuid:'873bfe0b-58d8-45d5-b599-55848d3edfa1',
    nonce:null,
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
    user_uuid:3452345
  };

  describe('insertNewUser', function() {
    xit('creates with happyInputs', function(done){ // can only run once
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.insertNewUser(happyInputs, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows[0]);
          expect(result.rows[0].email).to.equal('b@mailinator.com');
          done();
        })
      })
    })
    it('fails with alreadyExistInputs', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.insertNewUser(alreadyExistInputs, (err, result) => {
          should.exist(err);
          err.should.be.an.instanceOf(Error);
          expect(err).to.match(/duplicate/g)
          done();
        })
      })
    })
    it('fails with checkInputsEmail', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.insertNewUser(checkInputsEmail, (err, result) => {
          should.exist(err);
          err.should.be.an.instanceOf(Error);
          expect(err).to.match(/email/g)
          done();
        })
      })
    })
    it('fails with checkInputsPhone', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.insertNewUser(checkInputsPhone, (err, result) => {
          should.exist(err);
          err.should.be.an.instanceOf(Error);
          expect(err).to.match(/phone/g)
          done();
        })
      })
    })
    it('fails with checkInputsPassword', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.insertNewUser(checkInputsPassword, (err, result) => {
          should.exist(err);
          err.should.be.an.instanceOf(Error);
          expect(err).to.match(/password/g)
          done();
        })
      })
    })
    it('fails with wrongTypeInputs', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.insertNewUser(wrongTypeInputs, (err, result) => {
          should.exist(err);
          err.should.be.an.instanceOf(Error);
          done();
        })
      })
    })
  })
  describe('insertNewNonce', function() {
    xit('creates with happy Inputs', function(done){ // can only run once
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.insertNewNonce(happyInputs, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows[0]);
          expect(result.rows[0].user_uuid).to.equal('873bfe0b-58d8-45d5-b599-55848d3edfa1');
          done();
        })
      })
    })
    it('fails with alreadyExistInputs', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.insertNewNonce(alreadyExistInputs, (err, result) => {
          should.exist(err);
          err.should.be.an.instanceOf(Error);
          expect(err).to.match(/duplicate/g)
          done();
        })
      })
    })
    it('fails with null nonce', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.insertNewNonce(nullNonce, (err, result) => {
          should.exist(err);
          err.should.be.an.instanceOf(Error);
          expect(err).to.match(/null/g)
          done();
        })
      })
    })
  })
})
