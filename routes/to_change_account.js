const express = require('express');
const router = express.Router();
const sessionCheck = require('./session_check');

// render change
router.get('/to_change_email', function(req,res,next) {
  sessionCheck.sessionCheck(req, function(resultingRow) {
    res.render('account_info',{
      title: "Change your information",
      subtitle: "type in a new email",
      email: resultingRow.email,
      phone: resultingRow.phone,
      emailChange: true
    });
  })
});

router.get('/to_change_phone', function(req,res,next) {
  sessionCheck.sessionCheck(req, function(resultingRow) {
    res.render('account_info',{
      title: "Change your information",
      subtitle: "type in a new phone number",
      email: resultingRow.email,
      phone: resultingRow.phone,
      phoneChange: true
    });
  })
});


module.exports = router;
