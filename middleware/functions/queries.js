const helper = require('./helpers')

// is open to many text/values doesn
function selectRowViaEmail() {
  console.log('selectRowViaEmail');
  return function (req, res, next) {
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
  console.log('selectRowViaEmailTwo');
  return function (req, res, next) {
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
  console.log('selectNonceAndTimeViaUID');
  return function (req, res, next) {
    var text = 'SELECT nonce, theTime FROM nonce WHERE user_uuid = $1'
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
  console.log('insertNewUser');
  return function (req, res, next) {
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
  console.log('insertNewNonce');
  return function (req, res, next) {
    var text = 'INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2)';
    var values = [res.locals.row.user_uuid, helper.makeRandomString()];

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
  console.log('updateNonce');
  return function(req,res,next) {
    var nonce = helper.makeRandomString()
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

// update password
function updatePassword() {
  console.log('updatePassword');
  return function(req, res, next) {
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
  console.log('removeUserViaEmail');
  return function(req, res, next) {
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
  updateNonce: updateNonce,
  updatePassword: updatePassword,
  removeUserViaEmail: removeUserViaEmail,
};
