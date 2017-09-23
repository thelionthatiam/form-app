const express = require('express');
const router = express.Router();
const sessionCheck = require('../middleware/session-check');

// delete account
router.post('/delete', function (req, res, next) {
  sessionCheck.check(req, res, function(resultingRow) {
    var text = "DELETE FROM users WHERE email = $1"
    var values = [req.session.user[0]];

    req.conn.query( text, values, function (err, result) {
      if (err) {
        console.log(err);
        res.render('account-info', {dbError: "Could not delete, try again." })
      } else {
        res.render('index', {title:"A pleasent form app", subtitle:"Welcome back!" });
      }
    })
  })
})

module.exports = router;
