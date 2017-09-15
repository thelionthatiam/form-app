const express = require('express');
const router = express.Router();
const sessionCheck = require('./session_check');

//render shop
router.get('/back_account_actions', function(req,res,next) {
  sessionCheck.sessionCheck(req, function(resultingRow) {
    res.render('account_actions', { title: "back to the account action page", email: resultingRow.email });
  })
});

module.exports = router;
