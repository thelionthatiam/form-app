const express = require('express');
const router = express.Router();
const app = express();
const fs = require('fs');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const hbs = require('express-handlebars');
const pg = require('pg');
const path = require('path');
const { Client } = require('pg');
const { databaseInformation } = require('../database/database-information');
const client = new Client(databaseInformation);
const bcrypt = require('bcrypt');
const validation = require('../middleware/validation');
const session = require('express-session');
const sessionCheck = require('../middleware/session-check');
const mainFunc = require('../app');

client.connect();

//to sign up page
router.get('/to-login', function(req, res, next) {
  res.render('login', null );
});

// login and set cookie data
router.post('/to-account-actions', function(req, res, next) {
  console.log('one');
  var text = 'SELECT * FROM users WHERE email = $1';
  var values = [req.body.email];

  mainFunc.login(req, res, text, values);

})

//render shop
router.get('/back-account-actions', function(req,res,next) {
  sessionCheck.sessionCheck(req, function(resultingRow) {
    res.render('account-actions', { title: "back to the account action page", email: resultingRow.email });
  })
});


module.exports = router;
