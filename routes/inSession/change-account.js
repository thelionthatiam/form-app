const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sessionCheck = require('../middleware/session-check');

// render change email page
router.get('/to-change-email', function(req,res,next) {
  sessionCheck.check(req, res, function(resultingRow) {
    req.render('account-info',{
      title: "Change your information",
      subtitle: "type in a new email",
      email: resultingRow.email,
      phone: resultingRow.phone,
      emailChange: true
    });
  })
});

//render change phone page
router.get('/to-change-phone', function(req,res,next) {
  sessionCheck.check(req, res, function(resultingRow) {
    req.render('account-info',{
      title: "Change your information",
      subtitle: "type in a new phone number",
      email: resultingRow.email,
      phone: resultingRow.phone,
      phoneChange: true
    });
  })
});



// change email: update database, update session, check the session
router.post('/change-email', function (req, res, next) {
  var text = "UPDATE users SET email = $1 WHERE email = $2"
  var values = [req.body.email, req.session.user[0]];

  req.conn.query(text, values, function(err, result) {
    if(err) {
      console.log(err);
      res.render('account-info', {dbError: "Could not delete, try again." });
    } else {
      console.log(result);
      req.session.user[0] = req.body.email
      sessionCheck.check(req, res, function(resultingRow) {
        res.render('account-info', {
          subtitle: 'email updated',
          email: resultingRow.email,
          phone: resultingRow.phone,
          changeEmail:false
        });
      })
    }
  })
})

// change phone: update database, check the session
router.post('/change-phone', function (req, res, next) {
  var text = "UPDATE users SET phone = $1 WHERE email = $2"
  console.log(req.body.phone, req.session.user[0]);
  var values = [req.body.phone, req.session.user[0]];

  req.conn.query(text, values, function(err, result) {
    if(err) {
      console.log(err);
      res.render('account-info', {dbError: "Could not delete, try again." });
    } else {
      console.log(result);
      sessionCheck.check(req, res, function(resultingRow) {
        res.render('account-info', {
          subtitle: 'phone number updated',
          email: resultingRow.email,
          phone: resultingRow.phone,
          changePhone:false
        });
      })
    }
  })
})

// change password: hash new pass, update database, update session, check the session
router.post('/change-password', function (req, res, next) {
  var password = bcrypt.hashSync(req.body.changePassword, 10);
  var text = "UPDATE users SET password = $1 WHERE email = $2"
  var values = [password, req.session.user[0]];

  req.conn.query(text, values, function(err, result) {
    if(err) {
      console.log(err)
      res.render('account-info', {dbError: "Could not delete, try again." });
    } else {
      req.session.user[1] = password
      sessionCheck.check(req, res, function(resultingRow) {
        res.render('account-info', {
          subtitle: 'password updated',
          email: resultingRow.email,
          phone: resultingRow.phone,
          changePassword:false
        });
      })
    }
  })
})

//render shop
router.get('/back-account-actions', function(req,res,next) {
  sessionCheck.check(req, res, function(resultingRow) {
    res.render('account-actions', { title: "back to the account action page", email: resultingRow.email });
  })
});

module.exports = router;
