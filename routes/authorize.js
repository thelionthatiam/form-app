const express = require('express');
const query = require('../functions/queries');
const helper = require('../functions/helpers');
const lib = require('../functions/lib');
const router = express.Router();


router.get('/to-login', function(req, res, next) {
  console.log('/to-login');
  res.render('login', null );
});

router.post('/login', function(req, res, next) {
  console.log('/login');

  var thisPage = 'login';
  var nextPage ='account-actions';
  var inputs = {
    email: req.body.email,
    password: req.body.password,
  };

  req.querySvc.selectRowViaEmail(inputs, function(err, result) {
    if (err) {
      helper.dbError(res, thisPage, err);
    } else {
      if (result.rows.length === 0) {
        helper.genError(res, thisPage, "Email not found"); // u
      } else {
        var output = result.rows[0]
        var realPass = output.password;
        helper.hashCheck(req.body.password, realPass, function(err, result) {
          if (err) {
            // expand error translator to include bcrypt?
            helper.genError(res, thisPage, "Password encryption error"); // u
          } else if (result === false ) {
            helper.genError(res, thisPage, "Password incorrect."); // u
          } else {
            req.session.user = [output.email, output.password, output.phone];
            req.session.userID = output.user_uuid;
            res.render(nextPage, {
              title: 'yo',
              email: req.session.user[0],
            });
          }
        });
      }
    }
  });
});

router.post('/log-out', function(req, res, next) {
  console.log('/log-out');
  var thisPage = 'error';
  var nextPage = 'index';
  lib.logout(req, res, thisPage);
});

router.post('/delete', function(req, res, next) {
  console.log('/delete');

  var thisPage = 'login';
  var nextPage ='index';
  var inputs = {
    email: req.body.email,
    password: req.body.password,
  };

  req.querySvc.selectRowViaEmail(inputs, function(err, result) {
    if (err) {
      helper.dbError(res, thisPage, err);  // u
    } else {
      if (result.rows.length === 0) {
        helper.genError(res, thisPage, 'Email not found.'); // u
      } else {
        var output = result.rows[0]
        var realPass = output.password;
        helper.hashCheck(req.body.password, realPass, function(err, result) {
          if (err) {
            // expand error translator to include bcrypt?
            helper.genError(res, thisPage, "Password encryption error"); // u
          } else if (result === false ) {
            helper.genError(res, thisPage, "Password incorrect.");
          } else {
            req.querySvc.removeUserViaEmail(inputs, function (err, result) {
              if (err) {
                helper.dbError(res, thisPage, err); // u
              } else {
                lib.logout(req, res, thisPage, "Welcome back! Your account was deleted, make a new one if you want to come back in");
                lib.logout(req, res, thisPage, "Welcome back! Your account was deleted, make a new one if you want to come back in.");
              }
            });
          }
        });
      }
    }
  });
});

module.exports = router;
