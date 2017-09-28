const express = require('express');
const router = express.Router();
const abFunc = require('../middleware/abstracted-functions');

// to account information
router.get('/to-manage-account', function( req, res, next) {
    res.render('manage-account', {
      subtitle: "click change if you need to fix something",
      email: req.user.email,
      phone: req.user.phone
    });
})

// render change email page
router.get('/to-change-email', function(req,res,next) {
  res.render('manage-account',{
    title: "Change your information",
    subtitle: "type in a new email",
    email: req.user.email,
    phone: req.user.phone,
    emailChange: true
  });
});

//render change phone page
router.get('/to-change-phone', function(req,res,next) {
  res.render('manage-account',{
    title: "Change your information",
    subtitle: "type in a new phone number",
    email: req.user.email,
    phone: req.user.phone,
    phoneChange: true
  });
});



// change email
router.post('/change-email', function (req, res, next) {
  res.locals.thisPage = thisPage = 'manage-account';
  res.locals.nextPage = nextPage ='manage-account';
  res.locals.inputs = inputs = {
      email: req.body.email,
    }
  next();
  },
  function(req, res, next) {
    abFunc.genericQuery(
      "UPDATE users SET email = $1 WHERE email = $2",
      [inputs.email, req.user.email]
    )
  },
  abFunc.dbError(),
  function( req, res, next) {
    req.session.user[0] = req.body.email
    res.render(nextPage, {
      subtitle: 'email updated',
      email: req.user.email,
      phone: req.user.phone,
      changeEmail:false
    });
})

// change phone
router.post('/change-phone', function (req, res, next) {
  res.locals.thisPage = thisPage = 'manage-account';
  res.locals.nextPage = nextPage ='manage-account';
  res.locals.inputs = inputs = {
      phone: req.body.phone,
    }
  next();
  },
  function(req, res, next) {
    abFunc.genericQuery(
      "UPDATE users SET phone = $1 WHERE email = $2",
      [inputs.phone, req.user.email]
    )
  },
  abFunc.dbError(),
  function( req, res, next) {
    req.session.user[0] = req.body.email
    res.render(nextPage, {
      subtitle: 'phone number updated',
      email: req.user.email,
      phone: req.user.phone,
      changeEmail:false
    });
})


//render shop
router.get('/back-account-actions', function(req,res,next) {
  res.render('account-actions', { title: "back to the account action page", email: req.user.email});
});

module.exports = router;
