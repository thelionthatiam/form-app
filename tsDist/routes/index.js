var express = require('express');
var router = express.Router();
const fs = require('fs');
router.use('/account', require('./account'));
router.use('/auth', require('./authorize'));
router.use('/auth', require('./mailer'));
router.use('/in-session', require('./manage-account'));
router.use('/in-session', require('./shop'));
//render home page
router.get('/', function (req, res, next) {
    console.log('sessionId:', req.session.user);
    res.render('index', { title: 'A pleasent form app', subtitle: 'Put all your cares aside' });
});
router.get('/ref-error', function (req, res, next) {
    unknownthing;
    res.render('index', { title: "unknownthing again", subtitle: 'Put all your cares aside' });
});
// router.get('/gen-error', function (req, res, next) {
//   res.render('index', { title: 'A pleasent form app', subtitle:'Put all your cares aside' });
// })
module.exports = router;
