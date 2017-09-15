const express = require('express');
const router = express.Router();
const sessionCheck = require('./session_check');

//render shop
router.get('/shop', function(req,res,next) {
  sessionCheck.sessionCheck(req, function() {
    res.render('shop', { success:true });
  })
});

module.exports = router;
