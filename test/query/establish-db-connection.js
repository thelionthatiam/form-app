const chai = require('chai');
const expect = require("chai").expect;
const should = require("chai").should();
const db = require('../../database-config/database-information');
const { Query } = require('../../functions/queries');
const { Pool } = require('pg');
const pool = new Pool(db.databaseInformation);

// just testing db connection
// describe('database test set up', function() {
//   it('where pool exists', function() {
//     should.exist(pool);
//   })
//   it('where pool connects', function(done) {
//     pool.connect((err, client, release) => {
//       should.not.exist(err);
//       done();
//     })
//   })
//   it('gets a row', function(done) {
//     pool.connect((err, client, release) => {
//       client.query('SELECT * FROM users WHERE email = $1', ['newbie@mailinator.com'], (err, result) => {
//         should.not.exist(err);
//         should.exist(result.rows[0]);
//         expect(result.rows[0].phone).to.equal('1');
//         done();
//       })
//     })
//   })
// })

// only exporting pool for single-query tests
module.exports = {
  pool:pool,
}
