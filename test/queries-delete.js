const chai = require('chai');
const expect = require("chai").expect;
const should = require("chai").should();
const db = require('../database-config/database-information');
const { Query } = require('../functions/queries');
const { Pool } = require('pg');
const pool = new Pool(db.databaseInformation);


var validDelete = {
  email:'deleteme@a.aa',
}

var noUserDelete = {
  email:'deleteme@a.aa',
}

var invalidFormat = {
  email:1234,
}


describe('removeUserViaEmail', function() {
  it('deletes with validDelete', function(done) {
    pool.connect((err,client,release) => {
      var querySvc = new Query(client);
      querySvc.removeUserViaEmail(validDelete, (err, result) => {
        should.not.exist(err);
        done();
      })
    })
  })
  it('fails when there is nothing to delete', function(done) {
    pool.connect((err, client,release)=> {
      var querySvc = new Query(client);
      querySvc.removeUserViaEmail(noUserDelete, (err, result) => {
        should.not.exist(err);
        should.not.exist(result.rows[0]);
        done();
      })
    })
  })
  it('fails when there is an invalid format', function(done) {
    pool.connect((err, client,release)=> {
      var querySvc = new Query(client);
      querySvc.removeUserViaEmail(invalidFormat, (err, result) => {
        should.not.exist(err);
        should.not.exist(result.rows[0]);
        done();
      })
    })
  })
})
