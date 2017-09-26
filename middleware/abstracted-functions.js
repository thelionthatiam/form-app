const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const validation = require('./validation')

//insert into users from inputs

function insertToUsers() {
  return function (req, res, next) {
    var text = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';
    var values = [inputs.email, inputs.phone, inputs.password];
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

// get a row from Email
function getRowFromEmail() {
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


function unhashPass(res, next, input, compare) {
    if (bcrypt.compareSync(input, compare)) {
      next();
    } else {
      res.render(thisPage, {dbError:'Password is incorrect.'})
    }
}

function doesRowExist() {
  return function(req, res, next){
    if (res.locals === 'does not exist') {
      res.render(thisPage, {dbError:'Email not found.'} )
    } else {
      next();
    }
  }
}


function dbError() {
  return function(req, res, next) {
    if (res.locals.err !== undefined) {
      err = res.locals.err;
      var error = validation.errTranslator(err.constraint);
      res.render(thisPage, {dbError: error})
    } else {
      next();
    }
  }
}

function endSession() {
  return function(req, res, next) {
    req.session.destroy(function(err) {
      if (err) {
        res.locals.err = err;
        console.log(err)
        next();
      } else {
        req.session = null;
        next();
      }
    })
  }
}


//  this is aweful and sloppy.
function removeRowViaEmail() {
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
  insertToUsers:insertToUsers,
  getRowFromEmail: getRowFromEmail,
  unhashPass:unhashPass,
  doesRowExist: doesRowExist,
  dbError: dbError,
  endSession:endSession,
  removeRowViaEmail:removeRowViaEmail,
};


// 1 insertToUsers:insertToUsers,
// 2 getRowFromEmail: getRowFromEmail,
// 1 unhashPass:unhashPass,
// 2 doesRowExist: doesRowExist,
// 3 dbError: dbError,
// 1 endSession:endSession,
// 1 removeRowFromEmail:removeRowFromEmail,
