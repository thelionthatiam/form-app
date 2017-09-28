const express = require('express');
const router = express.Router();
const query = require('../middleware/functions/queries')
const helper = require('../middleware/functions/helpers')

router.get('/to-login', function(req, res, next) {
  res.render('login', null );
});

router.post('/login', function(req, res, next) {
  //could have more than one next page -- this pattern may change slightly
  res.locals.thisPage = thisPage = 'login';
  res.locals.nextPage = nextPage ='account-actions';
  res.locals.inputs = inputs = {
      email: req.body.email,
      password: req.body.password,
    }
  next();
  },
  query.selectRowViaEmail(),
  helper.dbError(),
  helper.doesRowExist(),
  function(req, res, next){
    helper.checkHashedString(res, next, inputs.password, res.locals.row.password);
  },
  function(req, res, next) {
    req.session.user = [res.locals.row.email, res.locals.row.password, res.locals.row.phone];
    res.render(nextPage, {
      title: 'yo',
      email: res.locals.row.email,
    })
})

router.post('/log-out', function(req, res, next) {
  res.locals.thisPage = thisPage = 'error';
  res.locals.nextPage = nextPage = 'index';
  next();
  },
  helper.endSession(),
  helper.dbError(),
  function(req,res,next) {
    res.render(nextPage, {
      title:"A pleasent form app",
      subtitle:"Welcome back!"
    });
  }
);


// almost exact repeat of login COMBINE!
router.post('/delete', function (req,res,next) {
  res.locals.thisPage = thisPage = 'login';
  res.locals.nextPage = nextPage ='index';
  res.locals.inputs = inputs = {
      email: req.body.email,
      password: req.body.password,
    }
  next();
  },
  query.selectRowViaEmail(),
  helper.dbError(),
  helper.doesRowExist(),
  function(req, res, next){
    helper.checkHashedString(res, next, inputs.password, res.locals.row.password);
  },
  query.removeUserViaEmail(),
  helper.endSession(),
  function(req, res, next) {
    res.render(nextPage, {
      title:"A pleasent form app",
      subtitle:"Welcome back! Your account was deleted, make a new one if you want to come back in."
    });
})

module.exports = router;
