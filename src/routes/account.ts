import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as url from 'url';
import { Inputs, PGOutput } from '../../typings/typings';
import { db } from '../middleware/async-database';
const router = express.Router();

let viewPrefix = 'account/'

router.route('/:email')
  .get((req,res) => {
    res.render(viewPrefix + 'my-account', {
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
        res.render(viewPrefix + 'my-account', { dbError: err.stack });
      });
  })


router.route('/:email/contact')
  .get((req,res) => {
    res.render(viewPrefix + 'my-contact', {
      email:req.session.user.email,
      phone:req.session.user.phone
    })
  })
  .put((req, res) => {
    let email = req.body.email;
    let phone = req.body.phone;
    let query = 'UPDATE users SET (email, phone) = ($1, $2) WHERE user_uuid = $3';
    let input = [email, phone, req.session.user.uuid];

    db.query(query, input)
      .then((result) => {
        req.session.user.email = email;
        req.session.user.phone = phone;

        res.render(viewPrefix + 'my-account', {
          title:"account updated",
          email:req.session.user.email
        })
      })
      .catch((err) => {
        console.log(err.stack)
        res.render(viewPrefix + 'my-account', { dbError: err.stack });
      });
  })


router.route('/:email/password')
  .get((req, res) => {
    res.render(viewPrefix + 'new-password', {
      email:req.session.user.email
    })
  })
  .post((req, res) => {
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

        if (result === false) {
          throw new Error('Password incorrect');
        } else {
          return bcrypt.hash(inputs.password, 10)
        }
      })
      .then((hash) => {

        inputs.password = hash;
        let query = 'UPDATE users SET password = $1 WHERE user_uuid = $2'
        let input = [inputs.password, req.session.user.uuid]
        return db.query(query, input)
      })
      .then((result) => {
        res.render(viewPrefix + 'new-password', {
          success:true,
          email:req.session.user.email
        })
      })
      .catch((error) => {
        console.log(error)
        res.render(viewPrefix + 'new-password', { dbError: error })
      })
  })

module.exports = router;
