const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const abFunc = require('../middleware/abstracted-functions')

//to sign up page
router.get('/to-create', function(req, res, next) {
  res.render('create-account', {success: false});
});

//sends user information to database,
router.post('/create', function (req, res, next) {
  res.locals.thisPage = thisPage = 'create-account';
  res.locals.nextPage = nextPage ='create-account';
  res.locals.inputs = inputs = {
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, 10),
    }
  next();
  },
  abFunc.insertToUsers(),
  abFunc.dbError(),
  function(req, res, next) {
    res.render(nextPage, {
      success: true,
      email: inputs.email,
      phone: inputs.phone,
    });
  }
)

router.post('/delete', function (req, res, next) {
  res.locals.thisPage = thisPage = 'account-actions';
  res.locals.nextPage = nextPage ='login';
  next();
  },
  function (req, res, next) {
    res.render(nextPage, {
      accountDelete:true,
    });
  }
)

module.exports = router;
