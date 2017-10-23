const chai = require('chai');
const expect = require("chai").expect;
const should = require("chai").should();
const db = require('../database-config/database-information');
const { Query } = require('../functions/queries');
const { Pool } = require('pg');
const pool = new Pool(db.databaseInformation);

describe('UPDATE query function', function() {
  var happyPath = {
    user_uuid:'f0e144b8-2194-4055-8099-9863b5e475b5',
    nonce:'$2a$10$yMmmeaEXy0jl2BHXs/urS.aiCqcf/Ddcdy3BxpmQ7qvni1/gk4ArW',
    email:'b@mailinator.com',
    newPhone:'2',
    hashedPassword:'thisisanewpassword',
  }

  var emailUpdate = {
    email:'a@mailinator.com',
    newEmail:'newnewbie@mailinator.com',
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

  describe('updateNonce',function(){
    it('updates with the happyPath', function(done) {
      pool.connect((err,client,release) => {
        var querySvc = new Query(client);
        querySvc.updateNonce(happyPath, (err, result) => {
          should.not.exist(err);
          done();
        })
      })
    })
    it('fails when there is no selector', function(done) {
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.updateNonce(noSelector, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.updateNonce(invalidUpdate, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
  })
  describe('updateEmail',function(){
    it('updates with the happyPath (emailUpdate)', function(done) {
      pool.connect((err,client,release) => {
        var querySvc = new Query(client);
        querySvc.updateEmail(emailUpdate, (err, result) => {
          should.not.exist(err);
          done();
        })
      })
    })
    it('fails when there is no selector', function(done) {
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.updateEmail(noSelector, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
    xit('fails when there is an invalidUpdate', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.updateEmail(invalidUpdate, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
  })
  describe('updatePhone',function() {
    it('updates with the happyPath', function(done) {
      pool.connect((err,client,release) => {
        var querySvc = new Query(client);
        querySvc.updatePhone(happyPath, (err, result) => {
          should.not.exist(err);
          done();
        })
      })
    })
    it('fails when there is no selector', function(done) {
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.updatePhone(noSelector, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.updateNonce(invalidUpdate, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
  })
  describe('updatePassword',function() {
    it('updates with the happyPath', function(done) {
      pool.connect((err,client,release) => {
        var querySvc = new Query(client);
        querySvc.updatePassword(happyPath, (err, result) => {
          should.not.exist(err);
          done();
        })
      })
    })
    it('fails when there is no selector', function(done) {
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.updatePassword(noSelector, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.updatePassword(invalidUpdate, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
  })
})
