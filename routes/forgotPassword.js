const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const generator = require('../middleware/generator')

router.post('forgotPassMail', makeNewPass)
function makeNewPass (req, res, next) {
  var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'this1234567890is1234567890test@gmail.com',
      pass: 'Mapex133'
    }
  });

  var mailOptions = {
    from: 'juliantheberge@gmail.com',
    to: req.body.email,
    subject: 'Password reset from form app',
    text: "http://localhost:3000/forgotPassword"
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {

      console.log('Email sent: ' + info.response);
      req.session.token = generator.nonce();
      var text = 'SELECT user_uuid FROM users WHERE email = $1';
      var values = [req.body.email]
      req.conn.query(text, values, function(err, result) {
        if (err) {
          res.render('login', { dbError: "something went wrong, try to log in again"});
        } else if (result.rowCount === 0) {
          req.session = null;
          res.render('login', { dbError: "That email is not in our database. Try again."});
        } else {
          req.session.token = makeString();
          var text = 'INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2)';
          var values = [result.rows[0].user_uuid, req.session.token];

          req.conn.query(text, values, function(err, result) {
            if (err) {
              res.render('login', { dbError: err});
            } else {
              req.tempEmail = req.body.email
              res.render('logn', (dbError: 'check your email for password reset'))
            }
          })
        }
      })
    };
  })
}


router.get('/forgot-password', function(req, res, next) {
  var text = 'SELECT nonce, theTime FROM nonce WHERE user_uuid = $1'
  var values = [req.user.userID];

    req.conn.query(text, values, function (err, result) {
      if (err) {
        res.render('account-info', { dbError: err});
      } else {
        //set this up better
        var nonce = result.rows[0].nonce;
        var oldDate = new Date(result.rows[0].thetime);
        var oldTime = oldDate.getTime();
        var currentDate = new Date();
        var currentTime = currentDate.getTime();

        if (req.session.token === nonce && currentTime < oldTime + 120000) {
          req.session.token = null;
          var text = 'DELETE FROM nonce WHERE user_uuid = ($1)';
          var values = [req.user.userID]
          req.conn.query(text, values, function(err, result) {
            if (err) {
              console.log(err)
              res.render('login', { dbError: 'Sorry, there was an error!'});
            } else {
              res.render('account-info', { passwordChange: true });
            }
          })

        } else {
          req.session.token = null;
          var text = 'DELETE FROM nonce WHERE user_uuid = ($1)';
          var values = [req.user.userID];

          req.conn.query(text, values, function(err, result) {
            if (err) {
              console.log(err)
              res.render('login', { dbError: 'Sorry, there was an error!'});
            } else {
              res.render('account-info', { dbError: 'Sorry, your token expired, send a new one!'});
            }
          })
        }
     }
  });
})

router.post('/forgot-password', function(req,res,next) {
  var password = bcrypt.hashSync(req.body.password, 10);
  var text = "UPDATE users SET password = $1 WHERE email = $2"
  var values = [password, req.body.email]

  req.conn.query(text,values,function(err, result) {
    if (err) {
      res.render('login', { dbError: "Something went wrong try to reset the password again."});
    }
  })
})
