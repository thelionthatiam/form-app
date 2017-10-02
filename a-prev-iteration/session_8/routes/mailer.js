const express = require('express');
const query = require('../middleware/functions/queries')
const helper = require('../middleware/functions/helpers')
const mailConfig = require('../gen-config/mail-config')
const router = express.Router();


router.post('/mailer', function(req, res, next) {
  console.log('/mailer')
  res.locals.thisPage = thisPage = 'login';
  res.locals.nextPage = nextPage ='email-password';
  // if logged in, email typed in or neither
  if (typeof req.session.user !==  'undefined') {
    mailConfig.mailOptions.to = req.session.user[0];

    res.locals.inputs = inputs = {
      email:req.session.user[0],
    }
    next();
  } else if (typeof req.body.email === 'string') {
    mailConfig.mailOptions.to = req.body.email;
    res.locals.inputs = inputs = {
      email:req.body.email,
    }
    next();
  } else {
    res.render('email-password', {mailNotSent:true})
  }
},
  query.selectRowViaEmail(),
  helper.dbError(),
  helper.doesRowExist(),
  query.updateNonce(),
  helper.dbError(),
  helper.sendMail(mailConfig.mailOptions, mailConfig.transporter),
  helper.dbError(),
  function(req, res, next) {
    res.render(nextPage, {
      message: "go check your email and follow the link",
    });
  }
)



router.get('/new-password', function(req, res, next) {
  console.log('/new-password')
  res.locals.thisPage = thisPage = 'login';
  res.locals.nextPage = nextPage ='new-password';
  next();
},
  query.selectNonceAndTimeViaUID(),
  helper.dbError(),
  helper.doesRowExist(),
  helper.isSessionTokenValid(),
  function (req, res, next) {
    console.log(res.locals.valid)
    if (res.locals.valid) {
      res.render(nextPage, null)
    } else {
      res.render(thisPage, { dbError: 'Sorry, your token expired. Login again.' })
    }
})


// change password: hash new pass, update database, update session, check the session
router.post('/change-password', function (req, res, next) {
  console.log('/change-password')
  res.locals.thisPage = thisPage = 'login';
  res.locals.nextPage = nextPage ='manage-account';
  res.locals.inputs = inputs = {
      password: helper.hash(req.body.password),
    }
  next();
  },
  query.updatePassword(),
  helper.dbError(),
  function(req, res, next) {
    mailOptions.to = null
    if (req.session && req.session.user) {
      req.session.user[1] = inputs.password
      res.render(nextPage, {
        subtitle: 'password updated',
        email: req.session.user[0],
        phone: req.session.user[2],
        changePassword:false
      });
    } else {
      console.log(query)
      res.render('login', { subtitle: "try your new password!" });
    }
  }
)


module.exports = router;














//end
