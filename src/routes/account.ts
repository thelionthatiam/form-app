import * as express from 'express';
import * as help from '../functions/promise-helpers';
import * as helper from '../functions/helpers';
import * as bcrypt from 'bcrypt';
import * as url from 'url';
import { Inputs, PGOutput, ModRequest } from '../../typings/typings';
import { db } from '../middleware/async-database';
const router = express.Router();


router.route('/:email')
  .get((req,res) => {
    res.render('my-account', {
      email:req.session.user.email,
    })
  })
  .delete((req, res) => {
    db.query('DELETE FROM users WHERE user_uuid = $1', [req.session.user.uuid])
      .then((result) => {
        res.render('login', {
          message:"account was deleted, please make a new one to enter"
        })
      })
      .catch((err) => {
        console.log(err.stack)
        res.render('my-account', { dbError: err.stack });
      });
  })


router.route('/:email/contact')
  .get((req,res) => {
    res.render('my-contact', {
      email:req.session.user.email,
      phone:req.session.user.phone
    })
  })
  .put((req, res) => {
    let email = req.body.email;
    let phone = req.body.phone;

    db.query('UPDATE users SET (email, phone) = ($1, $2) WHERE user_uuid = $3', [email, phone, req.session.user.uuid])
      .then((result) => {
        console.log(result)
        req.session.user.email = email;
        req.session.user.phone = phone
        res.render('my-account', {
          title:"account updated",
          email:req.session.user.email
        })
      })
      .catch((err) => {
        console.log(err.stack)
        res.render('my-account', { dbError: err.stack });
      });
  })


router.route('/:email/password')
  .get((req, res) => {
    res.render('new-password', {
      email:req.session.user.email
    })
  })
  .post((req, res) => {
    console.log
    let inputs = {
      password:req.body.password,
      oldPassword:req.body.oldPassword
    }
    db.query("SELECT * FROM users WHERE user_uuid = $1", [req.session.user.uuid])
      .then((result) => {
        console.log(result)
        return bcrypt.compare(req.body.oldPassword, result.rows[0].password)
      })
      .then((result) => {
        console.log(result)
        if (result === false) {
          throw new Error('Password incorrect');
        } else {
          return bcrypt.hash(inputs.password, 10)
        }
      })
      .then((hash) => {
        console.log(hash)
        inputs.password = hash;
        return db.query('UPDATE users SET password = $1 WHERE user_uuid = $2', [inputs.password, req.session.user.uuid])
      })
      .then((result) => {
        res.render('new-password', {
          success:true,
          email:req.session.user.email
        })
      })
      .catch((error) => {
        console.log(error)
        res.render('new-password', { dbError: error })
      })
  })

module.exports = router;
