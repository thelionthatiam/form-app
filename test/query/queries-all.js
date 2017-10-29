const chai = require('chai');
const should = require("chai").should();
const { expect } = require("chai");
const { Query } = require('../../functions/queries');
const { pool } = require('./establish-db-connection');


describe('INESRT query function', function() {
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
  };

  var checkInputsPassword = {
    email:'asdf@mailinator.com',
    phone:'1',
    password:null,
  };

  var wrongTypeInputs = {
    email: 1234,
    phone: 1234,
    password:{qwer:1234},
  };
  describe('insertNewUser', function() {
    it('creates with valid inputs', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(inputs, (err, result) => {
        if (err) { // not looking for an error
           done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows[0]);
            expect(result.rows[0].email).to.equal('test@mailinator.com');
            done();
          } catch(e) {
            done(e);
          }
        }
      });
    });
    it('fails with pre-existing inputs', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(inputs, (err, result) => {
        if (err) {
          try {
            should.exist(err);  // looking for an error
            err.should.be.an.instanceOf(Error);
            expect(err).to.match(/duplicate/g);
            done();
          } catch(e) {
            done(e);
          }
        } else {
          done(new Error('Unexpected Success'));
        }
      });
    });
    it('fails with checkInputsEmail', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(checkInputsEmail, (err, result) => {
        if (err) {
          try {
            should.exist(err); // looking for an error
            err.should.be.an.instanceOf(Error);
            expect(err).to.match(/check/g);
            done();
          } catch(e) {
            done(e);
          }
        } else {
          done(new Error('Unexpected Success'));
        }
      });
    });
    it('fails with checkInputsPhone', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(checkInputsPhone, (err, result) => {
        if (err) {
          try {
            should.exist(err);
            err.should.be.an.instanceOf(Error);
            expect(err).to.match(/phone/g);
            done();
          } catch(e) {
            done(e);
          }
        } else {
          done(new Error('Unexpected Success'));
        }
      });
    });
    it('fails with checkInputsPassword', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(checkInputsPassword, (err, result) => {
        if (err) {
          try {
            should.exist(err);
            err.should.be.an.instanceOf(Error);
            expect(err).to.match(/password/g);
            done();
          } catch(e) {
            done(e);
          }
        } else {
          done(new Error('Unexpected Success'));
        }
      });
    });
    it('fails with wrongTypeInputs', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewUser(wrongTypeInputs, (err, result) => {
        if (err) {
          try {
            should.exist(err);
            err.should.be.an.instanceOf(Error);
            done();
          } catch(e) {
            done(e);
          }
        } else {
          done(new Error('Unexpected Success'));
        }
      });
    });
  });
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
            if (err) {
              done(err);
            } else {
              try {
                should.not.exist(err);
                should.exist(result.rows[0]);
                expect(result.rows[0].user_uuid).to.equal(inputs.user_uuid);
                done();
              } catch(e) {
                done(e);
              }
            }
          });
        }
      });
    });
    it('fails with pre-existing inputs', function(done){
      var querySvc = new Query(pool);
      querySvc.insertNewNonce(inputs, (err, result) => {
        if (err) {
          try {
            should.exist(err);
            err.should.be.an.instanceOf(Error);
            expect(err).to.match(/duplicate/g)
            done();
          } catch(e) {
            done(e)
          }
        } else {
          done(new Error('Unexpected Success'));
        }
      });
    });
    it('fails with null nonce', function(done){
      var querySvc = new Query(pool);
      inputs.nonce = null; // update nonce to be null

      querySvc.insertNewNonce(inputs, (err, result) => {
        if (err) {
          try {
           should.exist(err);
           err.should.be.an.instanceOf(Error);
           expect(err).to.match(/null/g)
           done();
          } catch(e) {
           done(e)
          }
        } else {
          done(new Error('Unexpected Success'));
        }
      });
    });
  });
});


// test inputs
inputs = {
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

wrongTypeInputs = {
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
        if (err) {
          done(err)
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows[0]);
            expect(result.rows[0].phone).to.equal('465789011');
            done();
          } catch (e) {
            done(e)
          }
        }
      })
    })
    it('fails with nonExistantInputs', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(nonExistantInputs, (err, result) => {
        if (err) {
          done(err)
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch (e) {
            done(e)
          }
        }
      })
    })
    it('fails with checkInputs', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(checkInputs, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            done(e);
          }
        }
      })
    })
    it('fails with wrongTypeInputs', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(wrongTypeInputs, (err, result) => {
        if (err) {
          done(err)
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            done(e)
          }
        }
      })
    })
  })
  describe('selectNonceAndTimeViaUID', function() {
    it('gets a row with valid input', function(done){
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(inputs, (err, result) => { // nested callback to get randomly genereted uuid,
        if (err) {
          done(err);
        } else {
          inputs.user_uuid = result.rows[0].user_uuid;
          querySvc.selectNonceAndTimeViaUID(inputs, (err, result) => {
            if (err) {
              done(err);
            } else {
              try {
                should.not.exist(err);
                should.exist(result.rows[0]);
                expect(result.rows[0].nonce).to.equal('$2a$10$yMmmeaEXy0jl2BHXs/urS.aiCqcf/Ddcdy3BxpmQ7qvni1/gk4ArW');
                done();
              } catch(e) {
                done(e);
              }
           }
         })
       }
      });
    })
    it('fails with nonExistantInputs', function(done){
    var querySvc = new Query(pool);
      querySvc.selectNonceAndTimeViaUID(nonExistantInputs, (err, result) => {
        if (err) {
          done(err)
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0]);
            done();
          } catch(e) {
            done(e);
          }
        }
      })
    })
    it('fails with checkInputs', function(done){
    var querySvc = new Query(pool);
      querySvc.selectNonceAndTimeViaUID(checkInputs, (err, result) => {
        if (err) {
          try {
            should.exist(err);
            should.not.exist(result);
            err.should.be.an.instanceOf(Error);
            done();
          } catch(e) {
            done(e);
          }
        } else {
          done(new Error('Unexpected Success'));
        }
      })
    })
    it('fails with wrongTypeInputs', function(done){

    var querySvc = new Query(pool);
      querySvc.selectNonceAndTimeViaUID(wrongTypeInputs, (err, result) => {
        if (err) {
          try {
            should.exist(err);
            should.not.exist(result);
            err.should.be.an.instanceOf(Error);
            done();
          } catch(e) {
            done(e);
          }
        } else {
          done(new Error('Unexpected Success'));
        }
      })
    })
  })
})

inputs = {
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
          done(err);
        } else {
          console.log(result.rows[0].user_uuid);
          inputs.user_uuid = result.rows[0].user_uuid;
          querySvc.updateNonce(inputs, (err, result) => {
            if (err) {
              done(err)
            } else {
              try {
                should.not.exist(err);
                done();
              } catch(e) {
                done(e);
              }
            }
          })
        }
      });
    })
    it('fails when there is no selector', function(done) {
      var querySvc = new Query(pool);
      querySvc.updateNonce(noSelector, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            done(e);
          }
        }
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      var querySvc = new Query(pool);
      querySvc.updateNonce(invalidUpdate, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            done(e);
          }
        }
      })
    })
  })
  describe('updatePassword',function() {
    it('updates with valid inputs', function(done) {
      var querySvc = new Query(pool);
      querySvc.selectRowViaEmail(inputs, (err, result) => { // nested callback to get randomly genereted uuid,
        if (err) {
          done(err);
        } else {
          inputs.user_uuid = result.rows[0].user_uuid;
          querySvc.updatePassword(inputs, (err, result) => {
            if (err) {
              done(err);
            } else {
              try {
                should.not.exist(err);
                done();
              } catch(e) {
                done(e);
              }
            }
          })
        }
      });
    })
    it('fails when there is no selector', function(done) {
      var querySvc = new Query(pool);
      querySvc.updatePassword(noSelector, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            donee(e);
          }
        }
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      var querySvc = new Query(pool);
      querySvc.updatePassword(invalidUpdate, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            done(e);
          }
        }
      })
    })
  })
  describe('updatePhone',function() {
    it('updates with valid inputs', function(done) {
      var querySvc = new Query(pool);
      querySvc.updatePhone(inputs, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            done();
          } catch(e) {
            done(e)
          }
        }
      })
    })
    it('fails when there is no selector', function(done) {
      var querySvc = new Query(pool);
      querySvc.updatePhone(noSelector, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            done(e);
          }
        }
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      var querySvc = new Query(pool);
      querySvc.updateNonce(invalidUpdate, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            done(e);
          }
        }
      })
    })
  })
  describe('updateEmail',function(){
    it('updates with valid inputs', function(done) {
      var querySvc = new Query(pool);
      querySvc.updateEmail(inputs, (err, result) => {
        if (err) {
          console.log(err);
          done(err);
        } else {
          try {
            should.not.exist(err);
            done();
          } catch(e) {
            done(e)
          }
        }
      })
    })
    it('fails when there is no selector', function(done) {
      var querySvc = new Query(pool);
      querySvc.updateEmail(noSelector, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            done(e);
          }
        }
      })
    })
    it('fails when there is an invalidUpdate', function(done){
      var querySvc = new Query(pool);
      querySvc.updateEmail(invalidUpdate, (err, result) => {
        if (err) {
          done(err);
        } else {
          try {
            should.not.exist(err);
            should.exist(result.rows);
            should.not.exist(result.rows[0])
            done();
          } catch(e) {
            done(e);
          }
        }
      })
    })
  })
})

var validDelete = {
  email:'test@mailinator.com', // need to change backto newtest
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
      if (err) {
        done(err)
      } else {
        try {
          should.not.exist(err);
          done();
        } catch(e) {
          done(e);
        }
      }
    })
  })
  it('fails when there is nothing to delete', function(done) {
    var querySvc = new Query(pool);
    querySvc.removeUserViaEmail(noUserDelete, (err, result) => {
      if (err) {
        done(err)
      } else {
        try {
          should.not.exist(err);
          should.not.exist(result.rows[0]);
          done();
        } catch(e) {
          done(e)
        }
      }
    })
  })
  it('fails when there is an invalid format', function(done) {
    var querySvc = new Query(pool);
    querySvc.removeUserViaEmail(invalidFormat, (err, result) => {
      if (err) {
        done(err)
      } else {
        try {
          should.not.exist(err);
          should.not.exist(result.rows[0]);
          done();
        } catch(e) {
          done(e)
        }
      }
    })
  })
})
