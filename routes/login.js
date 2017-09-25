const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const validation = require('../middleware/validation');

//to sign up page
router.get('/to-login', function(req, res, next) {
  res.render('login', null );
});

// login and set cookie data
router.post('/to-account-actions', function(req, res, next) {
  var text = 'SELECT * FROM users WHERE email = $1';
  var values = [req.body.email];
  req.conn.query(text, values, (err, result) => {
    if (err) {
      var error = validation.errTranslator(err.constraint);
      res.render('login', { dbError: error });

    } else if (result.rowCount === 0) {
      res.render('login', { dbError: 'that email is not in the database' });

    } else {
      if (bcrypt.compareSync(req.body.password, result.rows[0].password)){
        req.session.user = [req.body.email, result.rows[0].password];
        res.render('account-actions', {title: 'Hi,', email:req.session.user[0]});

      } else {
        res.render('login', { dbError: 'Password is wrong.' });
      }
    }
  })
})


router.post('/to-log-out', function (req,res,next) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err.stack)
    } else {
      req.session = null;
      res.render('index', {title:"A pleasent form app", subtitle:"Welcome back!" });
    }
  })
});

module.exports = router;
