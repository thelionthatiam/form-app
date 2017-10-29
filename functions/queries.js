const helper = require('./helpers');

function Query(conn) {
  this.conn = conn;
}

// is open to many query/values doesn
Query.prototype.selectRowViaEmail = function (inputs, cb) {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [inputs.email];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err); // u
    } else {
      console.log('selectRowViaEmail');
      cb(null, result);
    }
  });
};


// select a nonce row from UUID
Query.prototype.selectNonceAndTimeViaUID = function (inputs, cb) {
  const query = 'SELECT nonce, theTime FROM nonce WHERE user_uuid = $1';
  const values = [inputs.user_uuid];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err);
    } else {
      console.log('selectNonceAndTimeViaUID');
      cb(null, result);
    }
  });
};

//insert into users from inputs
Query.prototype.insertNewUser = function (inputs, cb) {
  const query = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';
  const values = [inputs.email, inputs.phone, inputs.password];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err);
    } else {
      console.log('insertNewUser');
      cb(null, result);
    }
  });
};


// insert into nonce from user_uuid
// nonce failed
Query.prototype.insertNewNonce = function (inputs, cb) {
  const query = 'INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2) RETURNING *';
  const values = [inputs.user_uuid, inputs.nonce];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err);
    } else {
      console.log('insertNewNonce');
      cb(null, result);
    }
  });
};


// update nonce via user uuid
Query.prototype.updateNonce = function (inputs, cb) {
const query = "UPDATE nonce SET nonce = $1, theTime = default WHERE user_uuid = $2";
const values = [inputs.nonce, inputs.user_uuid];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err);
    } else {
      console.log('updateNonce');
      cb(null, result);
    }
  });
};


// update email
Query.prototype.updateEmail = function (inputs, cb) {
  const query = "UPDATE users SET email = $1 WHERE email = $2";
  const values = [inputs.newEmail, inputs.email];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err);
    } else {
      console.log('updateEmail');
      cb(null, result);
    }
  });
};


// update phone
Query.prototype.updatePhone = function (inputs, cb) {
  const query = "UPDATE users SET phone = $1 WHERE email = $2";
  const values = [inputs.newPhone, inputs.email];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err); // u
    } else {
      console.log('updatePhone');
      cb(null, result);
    }
  });
};


// update password
Query.prototype.updatePassword = function (inputs, cb) {
  const query = "UPDATE users SET password = $1 WHERE user_uuid = $2";
  const values = [inputs.hashedPassword, inputs.user_uuid];

  return this.conn.query(query, values, function(err, result) {
    if (err) {
      cb(err);
    } else {
      console.log('update password')
      cb(null, result);
    }
  });
};


//remove row through email ERR NOT COVERED
Query.prototype.removeUserViaEmail = function (inputs, cb) {
  const query = "DELETE FROM users WHERE email = $1";
  const values = [inputs.email];

  return this.conn.query(query, values, function (err, result) {
    if (err) {
      cb(err); // u
    } else {
      cb(null, result);
    }
  });
};

module.exports = { Query: Query };
