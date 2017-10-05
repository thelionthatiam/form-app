const express = require('express');
const query = require('../middleware/functions/queries')
const helper = require('../middleware/functions/helpers')
const router = express.Router();

//to sign up page
router.get('/to-create', function(req, res, next) {
  console.log('/to-create')
  res.render('create-account', {success: false});
});

//sends user information to database,
router.post('/create', function (req, res, next) {
  console.log('/create')
  var thisPage = 'create-account';
  var nextPage ='create-account';
  var inputs = {
    email: req.body.email,
    phone: req.body.phone,
    password:req.body.password,
  }
  helper.hash(inputs.password, function (err, hash) {
    // where is the err condition?
    inputs.password = hash
    req.querySvc.insertNewUser(inputs, function (err, result) {
      if (err) {
        res.render(thisPage, {dbError: helper.errTranslator(err)})
      } else {
        inputs.user_uuid = result.rows[0].user_uuid
        req.querySvc.insertNewNonce(req, inputs, function(err, result) {
          if (err) {
            res.render(thisPage, {dbError: helper.errTranslator(err)})
          } else {
            res.render(nextPage, {
              success: true,
              email: inputs.email,
              phone: inputs.phone,
            });
          }
        })
      }
    })
  })
})


router.post('/delete', function (req, res, next) {
  console.log('/delete')
  var thisPage = 'account-actions';
  var nextPage ='login';

  res.render(nextPage, {
    accountDelete:true,
  });
)

module.exports = router;
//
