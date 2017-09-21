const express = require('express');
const router = express.Router();
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
client.connect();

//to sign up page
router.get('/to-sign-up', function(req, res, next) {
  res.render('sign-up', {success: false});
});

//sends user information to database,
router.post('/sign-up', function (req, res, next) {
  var password = bcrypt.hashSync(req.body.password, 10);
  var values = [req.body.email, req.body.phone, password];
  var text = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';

  client.query(text, values, (err, result) => {

    if (err) {
      console.log(err);
      var error = validation.errTranslator(err.constraint);
      res.render('sign-up', { dbError: error, success:false });

    } else {
      res.render('sign-up', { success: true, email: req.body.email, phone: req.body.phone });

    }
  });
})



module.exports = router;
