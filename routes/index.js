var express = require('express');
var router = express.Router();

//render home page
router.get('/', function (req, res) {
  res.render('index', { title: 'A pleasent form app', subtitle:'Put all your cares aside' });
})

router.get('/an-error', function(req, res, next) {
  res.render('nowhere-land', null)
})

module.exports = router;
