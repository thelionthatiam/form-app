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

// loging out
router.get('/to-log-out', function (req,res,next) {
  req.session.destroy(function(err) {
    if (err) {
      res.json(err.stack);
    } else {
      req.session = null;
      console.log("on logout", req.session);
      res.render('index', {title:"A pleasent form app", subtitle:"Welcome back!" });
    }
  })
});
module.exports = router;
