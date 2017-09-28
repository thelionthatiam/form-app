const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const abFunc = require('../middleware/abstracted-functions')





function sendMail(mailOptions, transporter) {
  return function (req, res, next) {
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.locals.err = error;
        next();
      } else {
        console.log('Email sent: ' + info.response);
        next();
       }
    });
  }
}

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'this1234567890is1234567890test@gmail.com',
    pass: 'Mapex133'
  }
});

var mailOptions = {
  from: 'juliantheberge@gmail.com',
  to: null,
  subject: 'Password reset from form app',
  text: "http://localhost:3000/auth/new-password"
};

router.post('/mailer', function(req, res, next) {
  res.locals.thisPage = thisPage = 'login';
  res.locals.nextPage = nextPage ='email-password';
  // if logged in, email typed in or neither
  if (typeof req.session.user !==  'undefined') {
    mailOptions.to = req.session.user[0];
    res.locals.inputs = inputs = {
      email:req.session.user[0],
    }
    next();
  } else if (typeof req.body.email === 'string') {
    mailOptions.to = req.body.email;
    res.locals.inputs = inputs = {
      email:req.body.email,
    }
    next();
  } else {
    res.render('email-password', {mailNotSent:true})
  }
},
  abFunc.getRowFromEmailTwo(),
  abFunc.dbError(),
  abFunc.doesRowExist(),
  abFunc.updateNonce(),
  abFunc.dbError(),
  sendMail(mailOptions, transporter),
  abFunc.dbError(),
  function(req, res, next) {
    res.render(nextPage, {
      message: "go check your email and follow the link",
    });
  }
)



router.get('/new-password', function(req, res, next) {
  res.locals.thisPage = thisPage = 'login';
  res.locals.nextPage = nextPage ='new-password';
  next();
},
  abFunc.getNonceFromNonce(),
  abFunc.dbError(),
  abFunc.doesRowExist(),
  abFunc.isSessionTokenValid(),
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
  res.locals.thisPage = thisPage = 'login';
  res.locals.nextPage = nextPage ='manage-account';
  res.locals.inputs = inputs = {
      password: bcrypt.hashSync(req.body.password, 10),
    }
  next();
  },
  abFunc.updatePassword(),
  abFunc.dbError(),
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
