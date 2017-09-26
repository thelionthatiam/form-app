const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

// extremely general db query
function basicQuery(text, values, cb) {
  req.conn.query(text, values, function (err, result) {
    if (err) {
      cb(err)
    } else {
      cb(null, err)
    }
  })
}

// get a row
function getRowFromEmail(req, res, next) {
  var text = "SELECT * FROM users WHERE email = $1";
  var values = [req.body.email];
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

function unhashFailed(input, compare) {
  if (bcrypt.compareSync(input, compare)) {
    return false;
  } else {
    return true;
  }
}

// renders same page with error from database
function renderWithDBError(res, page, err) {
  var error = validation.errTranslator(err.constraint);
  res.render(page, { dbError: error })
}


// renders page with defined error
function renderWithError(res, page, params) {
  res.render(page, { dbError: params});
}


function renderNextPage(res, page, params) {
  res.render(page, params);
}


module.exports = {
  getRowFromEmail: getRowFromEmail,
  renderWithDBError: renderWithDBError,
  renderWithError: renderWithError,
  renderNextPage: renderNextPage,
  unhashFailed:unhashFailed,
};
