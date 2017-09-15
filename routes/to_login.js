var express = require('express');
var router = express.Router();

//to sign up page
router.get('/to_login', function(req, res, next) {
  res.render('login', null );
});

module.exports = router;
