const helper = require('./helpers')

// is open to many text/values doesn
function selectRowViaEmail() {
  return function (req, res, next) {
    console.log('selectRowViaEmail');
    var text = "SELECT * FROM users WHERE email = $1";
    var values = [inputs.email];

    req.conn.query(text, values, function(err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        if (result.rowCount === 0) {
          res.locals = 'does not exist';
          next();
        } else {
          res.locals.row = result.rows[0]
          next();
        }
      }
    })
  }
}

function selectRowViaEmailTwo() {
  return function (req, res, next) {
    console.log('selectRowViaEmailTwo');
    var text = "SELECT * FROM users WHERE email = $1";
    var values = [inputs.email];

    req.conn.query(text, values, function(err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        if (result.rowCount === 0) {
          res.locals = 'does not exist';
          next();
        } else {
          res.locals.row = result.rows[0]
          next();
        }
      }
    })
  }
}

// select a nonce row from UUID

function selectNonceAndTimeViaUID() {
  return function (req, res, next) {
    var text = 'SELECT nonce, theTime FROM nonce WHERE user_uuid = $1'
    console.log('selectNonceAndTimeViaUID');
    var values = [req.session.uuid];

    req.conn.query(text, values, function(err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        if (result.rowCount === 0) {
          res.locals = 'does not exist';
          next();
        } else {
          res.locals.row = result.rows[0]
          next();
        }
      }
    })
  }
}

//insert into users from inputs
function insertNewUser() {
  return function (req, res, next) {
    console.log('insertNewUser');
    var text = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';
    var values = [inputs.email, inputs.phone, inputs.password];
    req.conn.query(text, values, function(err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        res.locals.row = result.rows[0];
        next();
      }
    })
  }
}

// insert into nonce from user_uuid
function insertNewNonce() {
  return function (req, res, next) {
    console.log('insertNewNonce');
    var text = 'INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2)';
    var values = [res.locals.row.user_uuid, helper.makeHashedString()];

    req.conn.query(text, values, function(err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        req.session.uuid = res.locals.row.user_uuid
        next();
      }
    })
  }
}


// update nonce via user uuid
function updateNonce() {
  return function(req,res,next) {
    console.log('updateNonce');
    var nonce = helper.makeHashedString()
    req.session.token = nonce
    var text = "UPDATE nonce SET nonce = $1, theTime = default WHERE user_uuid = $2";
    var values = [nonce, res.locals.row.user_uuid];
    req.conn.query(text, values, function(err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        req.session.uuid = res.locals.row.user_uuid
        next();
      }
    })
  }
}

// update email
function updateEmail() {
  return function(req, res, next) {
    console.log('updateEmail');
    var text = "UPDATE users SET email = $1 WHERE email = $2";
    var values = [inputs.email, req.user.email];
    req.conn.query(text, values, function(err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        next();
      }
    })
  }
}

// update phone
function updatePhone(a, b) {
  return function(req, res, next) {
    console.log('updatePhone');
    var text = "UPDATE users SET phone = $1 WHERE email = $2";
    var values = [inputs.phone, req.user.email];
    req.conn.query(text, values, function(err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        next();
      }
    })
  }
}

// update password
function updatePassword() {
  return function(req, res, next) {
    console.log('updatePassword');
    var text = "UPDATE users SET password = $1 WHERE user_uuid = $2";
    var values = [inputs.password, req.session.uuid];
    req.conn.query(text, values, function(err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        next();
      }
    })
  }
}

//remove row through email
function removeUserViaEmail() {
  return function(req, res, next) {
    console.log('removeUserViaEmail');
    var text = "DELETE FROM users WHERE email = $1"
    var values = [inputs.email];

    req.conn.query( text, values, function (err, result) {
      if (err) {
        res.locals.err = err;
        next();
      } else {
        next();
      }
    })
  }
}

module.exports = {
  selectRowViaEmail: selectRowViaEmail,
  selectRowViaEmailTwo: selectRowViaEmailTwo,
  selectNonceAndTimeViaUID: selectNonceAndTimeViaUID,
  insertNewUser: insertNewUser,
  insertNewNonce: insertNewNonce,
  updateEmail: updateEmail,
  updatePhone: updatePhone,
  updateNonce: updateNonce,
  updatePassword: updatePassword,
  removeUserViaEmail: removeUserViaEmail,
};
