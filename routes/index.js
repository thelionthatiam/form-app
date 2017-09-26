var express = require('express');
var router = express.Router();

// router.use(require('./forgot-password'))
router.use('/account', require('./account'))
router.use('/auth', require('./authorize'))

router.use('/in-session', require('./account-information'));
router.use('/in-session', require('./change-account'));
router.use('/in-session', require('./mailer'));
router.use('/in-session', require('./shop'));

//render home page
router.get('/', function (req, res) {
  res.render('index', { title: 'A pleasent form app', subtitle:'Put all your cares aside' });
})

// general error handling
router.get('/an-error', function(req, res, next) {
  res.render('nowhere-land', null)
})

module.exports = router;
