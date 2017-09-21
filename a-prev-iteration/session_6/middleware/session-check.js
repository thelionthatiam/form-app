const express = require('express')
const pg = require('pg');
const path = require('path');
const { Client } = require('pg');
const { databaseInformation } = require('../database/database-information');
const client = new Client(databaseInformation);
const bcrypt = require('bcrypt');
const session = require('express-session');

client.connect();

var exports = module.exports = {};

// session check: query for table row, check session information against table, craete object to store user information
exports.sessionCheck = function(req, cb) {
  if (req.session && req.session.user){
    var text = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    var values = req.session.user;
    client.query(text, values, (err, result) => {
      if (err) {
        res.json(err.stack);

      } else if (result.rowCount === 0) {
        req.session = null;
        res.redirect('login', { dbError: "something went wrong, try to log in again"});

      } else {
          var resultingRow = {
            email: result.rows[0].email,
            phone: result.rows[0].phone
          }
          cb(resultingRow);
      }
    })
  } else {
    req.session = null;
    res.redirect('login', { dbError: "something went wrong, try to log in again"});
  }
}
