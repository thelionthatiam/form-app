import * as fs from "fs";
import * as help from '../functions/promise-helpers';
import * as helper from '../functions/helpers';
import * as bcrypt from 'bcrypt';
import { Inputs, PGOutput, ModRequest } from '../../typings/typings';
import { transporter, mailOptions } from "../config/mail-config.js";
import * as express from 'express';
import { db } from '../middleware/async-database';
const router = express.Router();

// render forgot pass page
router.get('/forgot-password', function (req, res, next) {
  res.render('login', {
    forgotPassword:true
  });
})

router.route('/forgot-password/authorized')
  .post((req, res) => {
    let uuid = '';
    let nonce = '';
    let email = req.body.email;


    db.query("SELECT * FROM users WHERE email = $1", [email])
      .then((result) => {
        console.log(result.rows)
        if (result.rows.length === 0) {
          console.log('should have error');
          throw new Error("Email not found");
        } else {
          uuid = result.rows[0].user_uuid
          console.log(uuid)
          return help.randomString
        }
      })
      .then((string) => {
        return bcrypt.hash(string, 10)
      })
      .then((hash) => {
        nonce = hash
        return db.query('UPDATE nonce SET nonce = $1, thetime = default WHERE user_uuid = $2', [hash, uuid])
      })
      .then((result) => {
        req.session.uuid = uuid;
        req.session.token = nonce;
        mailOptions.to = email;

        return transporter.sendMail(mailOptions)
      })
      .then((result) => {
        console.log(result);
        res.render('login', {
          forgotPassword:true,
          message: "check your email to authorize new password!"
        })
      })
      .catch((error) => {
        res.render('login', { forgotPassword:true, dbError: error })
      })
    })

    .get((req, res) => {
      let uuid = req.session.uuid
      db.query('SELECT * FROM nonce WHERE user_uuid = $1', [uuid])
        .then((result) => {
          if (result.rows.length === 0) {
            throw new Error("Account not found.")
          } else {
            var outputs = result.rows[0];
            var token = req.session.token;
            return help.isSessionValid(token, outputs)
          }
        })
        .then((result) => {
          if (result) {
            res.render('new-password', {
              forgotPassword:true,
              email:req.session.uuid,
            })
          }
        })
        .catch((error) => {
          console.log(error)
          res.render('login', { dbError: error })
        })
    })
    .put((req, res) => {
      let password = req.body.password;
      let uuid = req.session.uuid;
      console.log('PUT', uuid)
      bcrypt.hash(password, 10)
        .then((hash) => {
          console.log(hash)
          password = hash;
          return db.query('UPDATE users SET password = $1 WHERE user_uuid = $2', [password, uuid])
        })
        .then((result) => {
            console.log(result);
            res.render('login', {
              message:"try your new password"
            })
        })
        .catch((error) => {
          res.render('new-password', { forgotPassword:true, dbError: error, email:req.session.uuid })
        })
    })

module.exports = router;
