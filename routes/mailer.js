const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const generator = require('../middleware/generator')


router.post('/mailer', sendMail);

function sendMail (req, res, next) {
  var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'this1234567890is1234567890test@gmail.com',
      pass: 'Mapex133'
    }
  });

  var mailOptions = {
    from: 'juliantheberge@gmail.com',
    to: req.user.email,
    subject: 'Password reset from form app',
    text: "http://localhost:3000/inSession/recieveToken"
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      req.session.token = generator.nonce();
      var text = 'INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2)';
      var values = [req.user.userID, req.session.token];

      req.conn.query(text, values, function(err, result) {
        if (err) {
          res.render('account-info', { dbError: err});
        } else {
          res.render('account-info', { mailSent:true, email: req.user.email, phone: req.user.phone });
        }
      })
   }
  });
}

router.use('/recieveToken', function (req, res, next) {
  req.isSessionTokenValid = function (nonce) {
    var oldDate = new Date(result.rows[0].thetime);
    var oldTime = oldDate.getTime();
    var currentDate = new Date();
    var currentTime = currentDate.getTime();
    return (req.session.token === nonce && currentTime < oldTime + 120000)
  }
  next();
})

function isSessionTokenValid(req, nonce) {
  var oldDate = new Date(result.rows[0].thetime);
  var oldTime = oldDate.getTime();
  var currentDate = new Date();
  var currentTime = currentDate.getTime();
  return (req.session.token === nonce && currentTime < oldTime + 120000)
}


function deleteNonceForUser (req, cb) {
  req.session.token = null;
  var text = 'DELETE FROM nonce WHERE user_uuid = ($1)';
  var values = [req.user.userID]

  req.conn.query(text,values, function(err, result) {
    if (err) {
      cb(err)
    } else {
      cb (null, result)
    }
  })
}

function callbackFromDeleteNonce(res, params) {
  return function (err, result) {
    if (err) {
      console.log(err)
      res.render('login', { dbError: 'Sorry, there was an error!'});
    } else {
      res.render('account-info', params);
    }
  }
}

router.get('/recieveToken', function(req, res, next) {
  var text = 'SELECT nonce, theTime FROM nonce WHERE user_uuid = $1'
  var values = [req.user.userID];

    req.conn.query(text, values, function (err, result) {
      if (err) {
        res.render('account-info', { dbError: err});
      } else {
        var nonce = result.rows[0].nonce;
        if (req.isSessionTokenValid(nonce)) {
          deleteNonceForUser(req, callbackFromDeleteNonce(res, { passwordChange: true }));
        } else {
          deleteNonceForUser(req, callbackFromDeleteNonce(res, { dbError: 'Sorry, your token expired, send a new one!'}));
        }
     }
  });
})


module.exports = router;
