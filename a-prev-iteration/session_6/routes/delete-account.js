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

// delete account
router.post('/delete', function (req, res, next) {
  var text = "DELETE FROM users WHERE email = $1"
  var values = [req.session.user[0]];
  client.query( text, values, function (err, result) {
    if (err) {
      console.log(err);
      res.render('account-info', {dbError: "Could not delete, try again." })
    } else {
      res.render('index', {title:"A pleasent form app", subtitle:"Welcome back!" });
    }
  })
})

module.exports = router;
