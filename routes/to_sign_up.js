var express = require('express');
var router = express.Router();

//to sign up page
router.get('/to_sign_up', function(req, res, next) {
  res.render('sign_up', {success: false});
});

module.exports = router;
