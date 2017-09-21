var express = require('express');
var router = express.Router();

//render home page
router.get('/', function (req, res) {
  res.render('index', { title: 'A pleasent form app', subtitle:'Put all your cares aside' });
})

module.exports = router;
