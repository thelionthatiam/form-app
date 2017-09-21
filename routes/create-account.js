const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const validation = require('../middleware/validation');
const dbMiddleware = require('../middleware/database');

//to sign up page
router.get('/to-create-account', function(req, res, next) {
  res.render('create-account', {success: false});
});

//sends user information to database,
router.post('/create-account', function (req, res, next) {
  var password = bcrypt.hashSync(req.body.password, 10);
  var values = [req.body.email, req.body.phone, password];
  var text = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';

  req.conn.query(text, values, (err, result) => {

    if (err) {
      console.log(err);
      var error = validation.errTranslator(err.constraint);
      res.render('create-account', { dbError: error, success:false });

    } else {
      console.log('on create-account', req.session)
      console.log('on create-account', req.sessionID)
      res.render('create-account', { success: true, email: req.body.email, phone: req.body.phone });

    }
  });
})


module.exports = router;
