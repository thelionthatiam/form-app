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
    to: req.user.email,
    subject: 'Password reset from form app',
    text: "http://localhost:3000/inSession/recieveToken"
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      req.session.token = makeString();
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

router.get('/recieveToken', function(req, res, next) {
  var text = 'SELECT nonce, theTime FROM nonce WHERE user_uuid = $1'
  var values = [req.user.userID];

    req.conn.query(text, values, function (err, result) {
      if (err) {
        res.render('account-info', { dbError: err});
      } else {
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


module.exports = router;
