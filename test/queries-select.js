const chai = require('chai');
const expect = require("chai").expect;
const should = require("chai").should();
const db = require('../database-config/database-information');
const { Query } = require('../functions/queries');
const { Pool } = require('pg');
const pool = new Pool(db.databaseInformation);

// database connection works
describe('database test set up', function() {
  it('where pool exists', function() {
    should.exist(pool);
  })
  it('where pool connects', function(done) {
    pool.connect((err, client, release) => {
      should.not.exist(err);
      done();
    })
  })
  it('gets a row', function(done) {
    pool.connect((err, client, release) => {
      client.query('SELECT * FROM users WHERE email = $1', ['newbie@mailinator.com'], (err, result) => {
        should.not.exist(err);
        should.exist(result.rows[0]);
        expect(result.rows[0].phone).to.equal('1');
        done();
      })
    })
  })
})
describe('SELECT query function', function() {
  // test inputs
  var happyInputs = {
    email:'newbie@mailinator.com',
    phone:'1',
    password:'$2a$10$xKxTSC8oqqeO9IpMMYID0.mc.mnlkRI1M9XC6k3O36SJ9.zHuioJm', // has to be nonce because hashcheck is here in the server
    user_uuid:'873bfe0b-58d8-45d5-b599-55848d3edfa1'
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

  describe('selectRowViaEmail', function() {
    it('gets a row with valid input', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.selectRowViaEmail(happyInputs, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows[0]);
          expect(result.rows[0].phone).to.equal('1');
          done();
        })
      })
    })
    it('fails with nonExistantInputs', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.selectRowViaEmail(nonExistantInputs, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
    it('fails with checkInputs', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.selectRowViaEmail(checkInputs, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
    it('fails with wrongTypeInputs', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.selectRowViaEmail(wrongTypeInputs, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])
          done();
        })
      })
    })
  })


  describe('selectNonceAndTimeViaUID', function() {
    it('gets a row with valid input', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.selectNonceAndTimeViaUID(happyInputs, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows[0]);
          expect(result.rows[0].nonce).to.equal('$2a$10$1IGSqdcmoVixcL6vZnafUOT2yoHV9yG76hBUznORi9KTYM4DldKMe');
          done();
        })
      })
    })
    it('fails with nonExistantInputs', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.selectNonceAndTimeViaUID(nonExistantInputs, (err, result) => {
          should.not.exist(err);
          should.exist(result.rows);
          should.not.exist(result.rows[0])

          done();
        })
      })
    })
    it('fails with checkInputs', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.selectNonceAndTimeViaUID(checkInputs, (err, result) => {
          should.exist(err);
          should.not.exist(result);
          err.should.be.an.instanceOf(Error);
          done();
        })
      })
    })
    it('fails with wrongTypeInputs', function(done){
      pool.connect((err, client, release) => {
      var querySvc = new Query(client);
        querySvc.selectNonceAndTimeViaUID(wrongTypeInputs, (err, result) => {
          should.exist(err);
          should.not.exist(result);
          err.should.be.an.instanceOf(Error);
          done();
        })
      })
    })
  })
})
