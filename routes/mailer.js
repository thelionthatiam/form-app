const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

function makeString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,.<>/?;:'{}[]|";
  for (var i = 0; i <= 40; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  var text = bcrypt.hashSync(text, 10);
  return text;
}


router.post('/mailer', sendMail);
function sendMail (req, res, next) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'this1234567890is1234567890test@gmail.com',
      pass: 'Mapex133'
    }
  });

  var mailOptions = {
    from: 'juliantheberge@gmail.com',
    to: req.body.passwordReset,
    subject: 'Coming from the password reset page',
    text: makeString()
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      req.session.token = mailOptions.text;
      res.render('account_info', { mailSent: true });
    }
  });
}

router.post('/recieveToken', tokenChecker);
function tokenChecker(req, res, next) {
  if (req.session.token === req.body.tokenReciever) {
    req.session.token = null;
    res.render('account_info', { passwordChange:true });
  } else {
    res.render('account_info', { dbError: 'Incorrect token.' });
  }
}

module.exports = router;
