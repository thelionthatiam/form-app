const express = require('express');
const query = require('../middleware/functions/queries')
const helper = require('../middleware/functions/helpers')
const router = express.Router();

//to sign up page
router.get('/to-create', function(req, res, next) {
  console.log('/to-create')
  res.render('create-account', {success: false});
});

//sends user information to database,
router.post('/create', function (req, res, next) {
  console.log('/create')
  res.locals.thisPage = thisPage = 'create-account';
  res.locals.nextPage = nextPage ='create-account';
  res.locals.inputs = inputs = {
      email: req.body.email,
      phone: req.body.phone,
      password: helper.hash(req.body.password),
    }
  next();
  },
  query.insertNewUser(),
  helper.dbError(),
  query.insertNewNonce(),
  function(req, res, next) {
    res.render(nextPage, {
      success: true,
      email: inputs.email,
      phone: inputs.phone,
    });
  }
)

router.post('/delete', function (req, res, next) {
  console.log('/delete')
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
