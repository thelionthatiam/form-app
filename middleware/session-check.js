
// session check: query for table row, check session information against table, craete object to store user information
function sessionCheck(req, res, next) {
  if (req.session && req.session.user){
    // console.log(req.session.user)
    var text = 'SELECT * FROM users WHERE email = $1 AND password = $2 and phone = $3';
    var values = req.session.user;

    req.conn.query(text, values, (err, result) => {
      if (err) {
        res.json(err.stack);

      } else if (result.rowCount === 0) {
        console.log('row count was zero')
        req.session = null;
        res.render('login', { dbError: "something went wrong with the session, try to log in again"});

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
    res.render('login', { dbError: "you were no longer logged in, try to log in again"});
  }
}

module.exports = {
  check: sessionCheck
};
