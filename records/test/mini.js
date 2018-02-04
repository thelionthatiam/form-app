// const chai = require('chai');
// const expect = require("chai").expect;
// const should = require("chai").should();
// const db = require('../database-config/database-information');
// const { Query } = require('../functions/queries');
// const { Pool } = require('pg');
// const pool = new Pool(db.databaseInformation);
//
// var checkInputs = {
//   email:'Z8XFWPZrpm3fsiNfUwrQcTbvaTr1YWXAdfEC4KHvMQh9khDhqRehJZGS05GUDA219O8wMN8wMNxpmyumy0OC4cQQUvz2h8wMNxpmyumy0OC4cQQUvz2hxpmyu',
//   // phone:'a',
//   // password:'anything',
//   user_uuid:'somethingwrong'
// };
//
// var invalidUpdate = {
//   newPhone:'a',
//   email:'test@t.tt'
// }
//
// var invalidFormat = {
//   email:'Z8XFWPZrpm3fsiNfUwrQcTbvaTr1YWXAdfEC4KHvMQh9khDhqRehJZGS05GUDA219O8wMNxpmyumy0OC4cQQUvz2hkgNHBi2G9ZawCKmAJiNCtGkE2ZSiJPjbtf8tCE1a1BY9y8d7duNJ6SIG5vTc3J4UYwVGvhwp9Vvh83nxfzCRtXAi1gTewOqPAZUpsH7zPvFwm20cyKipVqpScCTSBvZYQ4XW1W3ELqSBi4sqkf9Z1eWzhoQ7NXyKma7iTdxKHkTi98J51ZO68zLRXfGEXQk2kqijsKex2YYGlGDXgVi8MQXeim0k5ZCgGi7316AN9pzQTkkuMsrQodLBQrMKd5fuvvdX0mc3UsezAYudFWJfvMuAM4V7g1noiMKsAeOlwDSNCoci2vOPWIWrcMZbvycMJd7MbpARXWuh48OgJgI0c9JUhfCJwhYiFdtHjt20FObtSEnpHCWOR21sSnwU7u3q8QX1a4',
// }
//
// describe('mini test', function() {
//   it('SELECT email fails with checkInputs', function(done){ // not producing error
//     var querySvc = new Query(pool);
//     querySvc.selectRowViaEmail(checkInputs, (err, result) => {
//       if (err) {
//         console.log(err);
//         try {
//           should.exist(err);
//           should.not.exist(result);
//           err.should.be.an.instanceOf(Error);
//           done();
//         } catch(e) {
//           done(e);
//         }
//       } else {
//         done(new Error('Unexpected Success'));
//       }
//     })
//   })
//   it('UPDATE phone fails with invalidUpdate', function(done){ // coverage
//     var querySvc = new Query(pool);
//     querySvc.updatePhone(invalidUpdate, (err, result) => {
//       if (err) {
//         try {
//           should.exist(err);
//           should.not.exist(result);
//           err.should.be.an.instanceOf(Error);
//           done();
//         } catch(e) {
//           done(e);
//         }
//       } else {
//         done(new Error('Unexpected Success'));
//       }
//     })
//   })
//   it('DELETE fails when there is an invalid email format', function(done) {
//     var querySvc = new Query(pool);
//     querySvc.removeUserViaEmail(invalidFormat, (err, result) => {
//       if (err) {
//         console.log(err);
//         try {
//           should.exist(err);
//           should.not.exist(result);
//           err.should.be.an.instanceOf(Error);
//           done();
//         } catch(e) {
//           done(e);
//         }
//       } else {
//         done(new Error('Unexpected Success'));
//       }
//     })
//   })
//   it('fails to render a page without being logged in', function(done) { // trying to get at session check, it is the same problem as SELECT *
//     authenticatedSession.get('/in-session/shop')
//     .expect(200)
//     .end((err, res) => {
//       if (err) {
//         try {
//           console.log(err);
//           should.exist(err);
//           err.should.be.an.instanceOf(Error);
//           done();
//         } catch(e) {
//           done(e)
//         }
//       } else {
//         done(new Error('Unexpected Success'));
//       }
//     })
//   })
// })
