const helper = require('../functions/helpers');

// session check: query for table row, check session information against table, craete object to store user information
function sessionCheck(req, res, next) {
  var thisPage = 'login';
  if (req.session && req.session.user){

    var text = 'SELECT * FROM users WHERE email = $1 AND password = $2 and phone = $3';
    var values = req.session.user;

    req.conn.query(text, values, (err, result) => {
      if (err) {
        helper.dbError(res, thisPage, err); // u
      } else if (result.rowCount === 0) {
        req.session = null; // u
        helper.genError(res, thisPage, "something went wrong with the session, try to log in again"); // u
      } else {
          req.user = {
            email: result.rows[0].email,
            phone: result.rows[0].phone,
            userID: result.rows[0].user_uuid
          }
          next();
      }
    })
  } else {
    req.session = null;
    helper.genError(res, thisPage, "you were no longer logged in, try to log in again");
  }
}

module.exports = {
  check: sessionCheck
};
