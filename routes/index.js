var express = require('express');
var router = express.Router();

router.use('/account', require('./account'))
router.use('/auth', require('./authorize'))
router.use('/auth', require('./mailer'));
router.use('/in-session', require('./manage-account'));
router.use('/in-session', require('./shop'));

//render home page
router.get('/', function (req, res, next) {
  console.log('sessionId:', req.session.user);
  res.render('index', { title: 'A pleasent form app', subtitle:'Put all your cares aside' });
})

module.exports = router;
