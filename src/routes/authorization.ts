import * as express from 'express';
import * as help from '../functions/promise-helpers';
import * as helper from '../functions/helpers';
import * as bcrypt from 'bcrypt';
import * as url from 'url';
import { Inputs, PGOutput, ModRequest } from '../../typings/typings';
import { db } from '../middleware/async-database';
const router = express.Router();



router.route('/authorized')
  .post((req, res) => {
    var output = {};

    db.query("SELECT * FROM users WHERE email = $1", [req.body.email])
      .then((result) => {
        if (result.rows.length === 0) {
          throw new Error("Email not found")
        } else {
          output = result.rows[0];
          return bcrypt.compare(req.body.password, result.rows[0].password)
        }
      })
      .then((result) => {
        if (result === false) {
          throw new Error('Password incorrect');
        } else {
          req.session.user = {
            uuid:output.user_uuid,
            id:output.id,
            email:output.email,
            phone:output.phone,
            password:output.password
          }
          console.log(req.session)
          res.render('home', {
            title:"yo",
            email:req.session.user.email
          })
        }
      })
      .catch((error) => {
        res.render('login', { dbError: error })
      })
  })



router.post('/log-out', function(req, res, next) {
    console.log("before destroy", req.session)
    req.session.destroy(function(err:Error) {
      if (err) {
        res.render('error', { errName: err.message, errMessage: null });
      } else {
        console.log("after destory", req.session)
        res.render('login');
      }
    });
  });


  module.exports = router;
