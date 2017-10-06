const helper = require('./helpers')

function Query(conn) {
  this.conn = conn;
}

// is open to many query/values doesn
Query.prototype.selectRowViaEmail = function (values, cb) {
  const query = "SELECT * FROM users WHERE email = $1"
  const inputs = [inputs.email];

  return req.conn.query(query, inputs, function(err, result) {
    if (err) {
      res.locals.err = err;
      next();
    } else {
      if (result.rowCount === 0) {
        res.locals = 'does not exist';
        next();
      } else {
        console.log('selectRowViaEmail');
        res.locals.row = result.rows[0]
        next();
      }
    }
  })
}

Query.prototype.selectRowViaEmailTwo = function (values, cb) {
  const query = "SELECT * FROM users WHERE email = $1"
  const inputs = [inputs.email];

  return req.conn.query(query, inputs, function(err, result) {
    if (err) {
      res.locals.err = err;
      next();
    } else {
      if (result.rowCount === 0) {
        res.locals = 'does not exist';
        next();
      } else {
        console.log('selectRowViaEmailTwo');
        res.locals.row = result.rows[0]
        next();
      }
    }
  })
}


// select a nonce row from UUID

Query.prototype.selectNonceAndTimeViaUID = function (values, cb) {
  const query = 'SELECT nonce, theTime FROM nonce WHERE user_uuid = $1'
  const inputs = [req.session.uuid];

  return req.conn.query(query, inputs, function(err, result) {
    if (err) {
      res.locals.err = err;
      next();
    } else {
      if (result.rowCount === 0) {
        res.locals = 'does not exist';
        next();
      } else {
        console.log('selectNonceAndTimeViaUID');
        res.locals.row = result.rows[0]
        next();
      }
    }
  })
}

//insert into users from inputs
Query.prototype.insertNewUser = function (inputs, cb) {
  const query = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';
  const values = [inputs.email, inputs.phone, inputs.password];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, result);
    }
  })
}


// insert into nonce from user_uuid
// nonce failed
Query.prototype.insertNewNonce = function (inputs, cb) {
  const query = 'INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2)';
  const values = [inputs.user_uuid, helper.makeHashedString()];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err);
    } else {
      console.log(result);
      cb(null, result);
    }
  })
}


// THIS MAY HAVE PROBLEMS NOT FIXED
// update nonce via user uuid
Query.prototype.updateNonce = function (values, cb) {
const query = "UPDATE nonce SET nonce = $1, theTime = default WHERE user_uuid = $2";
const nonce = helper.makeHashedString()
const inputs = [nonce, res.locals.row.user_uuid];
req.session.token = nonce

  return req.conn.query(query, inputs, function(err, result) {
    if (err) {
      res.locals.err = err;
      next();
    } else {
      console.log('updateNonce');
      req.session.uuid = res.locals.row.user_uuid
      next();
    }
  })
}


// update email
Query.prototype.updateEmail = function (values, cb) {
  const query = "UPDATE users SET email = $1 WHERE email = $2";
  const inputs = [inputs.email, req.user.email];

  return req.conn.query(query, inputs, function(err, result) {
    if (err) {
      res.locals.err = err;
      next();
    } else {
      console.log('updateEmail');
      next();
    }
  })
}


// update phone
Query.prototype.updatePhone = function (values, cb) {
  const query = "UPDATE users SET phone = $1 WHERE email = $2";
  const inputs = [inputs.phone, req.user.email];

  return req.conn.query(query, inputs, function(err, result) {
    if (err) {
      res.locals.err = err;
      next();
    } else {
      console.log('updatePhone');
      next();
    }
  })
}


// update password
Query.prototype.updatePassword = function (values, cb) {
  const query = "UPDATE users SET password = $1 WHERE user_uuid = $2";
  const inputs = [inputs.password, req.session.uuid];

  return req.conn.query(query, inputs, function(err, result) {
    if (err) {
      res.locals.err = err;
      next();
    } else {
      console.log('updatePassword');
      next();
    }
  })
}


//remove row through email
Query.prototype.removeUserViaEmail = function (values, cb) {
  const query = "DELETE FROM users WHERE email = $1"
  const inputs = [inputs.email];

  return req.conn.query( query, values, function (err, result) {
    if (err) {
      res.locals.err = err;
      next();
    } else {
      console.log('removeUserViaEmail');
      next();
    }
  })
}

module.exports = { Query: Query };

// module.exports = {
//   selectRowViaEmail: selectRowViaEmail,
//   selectRowViaEmailTwo: selectRowViaEmailTwo,
//   selectNonceAndTimeViaUID: selectNonceAndTimeViaUID,
//   insertNewUser: insertNewUser,
//   insertNewNonce: insertNewNonce,
//   updateEmail: updateEmail,
//   updatePhone: updatePhone,
//   updateNonce: updateNonce,
//   updatePassword: updatePassword,
//   removeUserViaEmail: removeUserViaEmail,
// };
