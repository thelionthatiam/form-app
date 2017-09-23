const express = require('express');
const router = express.Router();
const nodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');

function makeString() {
  var string = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,.<>/?;:'{}[]|";
  for (var i = 0; i <= 40; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  var string = bcrypt.hashSync(string, 10);
  return string;
}


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
    to: req.body.passwordReset,
    subject: 'Password reset from form app',
    text: "http://localhost:3000/recieveToken"
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      req.session.token = makeString();
      //now I need to query the user_id (which I may start storing as session data)
      var text = 'INSERT INTO nonce(email, nonce) VALUES ($1, $2)';
      var values = [req.session.user[0], req.session.token];
      console.log('initial query', req.session.token)

      req.conn.query(text, values, function(err, result) {
        if (err) {
          res.render('account-info', { dbError: err});
        } else {
          res.render('account-info', { mailSent: true });
        }
      })
    }
  });
}

router.get('/recieveToken', function(req, res, next) {
  var text = 'SELECT nonce FROM nonce WHERE email = $1'
  var values = [req.session.user[0]];

    req.conn.query(text, values, function (err, result) {
      if (err) {
        res.render('account-info', { dbError: err});
      } else {
        var nonce = result.rows[0].nonce;
        var oldTime = new Date(result.rows[0].theTime)
        var currentTime = new Date();

        if (req.session.token === nonce && currentTime < oldTime + 120000) {
          req.session.token = null;
          var text = 'DELETE FROM nonce WHERE email = ($1)';
          var values = [req.session.user[0]]
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
          var text = 'DELETE FROM nonce WHERE email = ($1)';
          var values = [req.session.user[0]];

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


module.exports = router;
