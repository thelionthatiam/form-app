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

// to account information
router.post('/to-account-info', function(req,res,next) {

  sessionCheck.sessionCheck(req, function(resultingRow) {

    console.log("on account info page", req.session);
    res.render('account-info', {
      subtitle: "click change if you need to fix something",
      email: resultingRow.email,
      phone: resultingRow.phone,
      password: resultingRow.password,
      changeEmail:false
    });
  })
})


module.exports = router;
