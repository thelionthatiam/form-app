const express = require('express');
const router = express.Router();
const fs = require('fs');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const hbs = require('express-handlebars');
const path = require('path');
const { databaseInformation } = require('../database/database-information');
const client = new Client(databaseInformation);
const bcrypt = require('bcrypt');
const validation = require('../middleware/validation');
const session = require('express-session');
const sessionCheck = require('../middleware/session-check');
client.connect();

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
      res.render('account-info', { mailSent: true });
    }
  });
}

router.post('/recieveToken', tokenChecker);
function tokenChecker(req, res, next) {
  if (req.session.token === req.body.tokenReciever) {
    req.session.token = null;
    res.render('account-info', { passwordChange:true });
  } else {
    res.render('account-info', { dbError: 'Incorrect token.' });
  }
}

module.exports = router;
