const express = require('express');
const router = express.Router();

// to account information
router.post('/to-account-info', function( req, res, next) {
  res.render('account-info', {
    subtitle: "click change if you need to fix something",
    email: req.user.email,
    phone: req.user.phone
  });
})


module.exports = router;
