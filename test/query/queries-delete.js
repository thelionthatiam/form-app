const chai = require('chai');
const should = require("chai").should();
const { expect } = require("chai");
const { Query } = require('../../functions/queries');
const { pool } = require('./establish-db-connection');


var validDelete = {
  email:'newtest@mailinator.com',
}

var noUserDelete = {
  email:'deleteme@a.aa',
}

var invalidFormat = {
  email:1234,
}

describe('removeUserViaEmail', function() {
  it('deletes with validDelete', function(done) {
    var querySvc = new Query(pool);
    querySvc.removeUserViaEmail(validDelete, (err, result) => {
      should.not.exist(err);
      done();
    })
  })
  it('fails when there is nothing to delete', function(done) {
    var querySvc = new Query(pool);
    querySvc.removeUserViaEmail(noUserDelete, (err, result) => {
      should.not.exist(err);
      should.not.exist(result.rows[0]);
      done();
    })
  })
  it('fails when there is an invalid format', function(done) {
    var querySvc = new Query(pool);
    querySvc.removeUserViaEmail(invalidFormat, (err, result) => {
      should.not.exist(err);
      should.not.exist(result.rows[0]);
      done();
    })
  })
})
