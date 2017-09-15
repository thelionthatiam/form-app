var express = require('express');
var router = express.Router();
const sessionCheck = require('./session_check');

// to account information
router.post('/to_account_info', function(req,res,next) {

  sessionCheck.sessionCheck(req, function(resultingRow) {

    console.log("on account info page", req.session);
    res.render('account_info', {
      subtitle: "click change if you need to fix something",
      email: resultingRow.email,
      phone: resultingRow.phone,
      password: resultingRow.password,
      changeEmail:false
    });
  })
})


module.exports = router;
