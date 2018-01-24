import * as express from 'express';
import * as help from '../functions/promise-helpers';
import * as bcrypt from 'bcrypt';
import { Inputs } from '../../typings/typings';
import { db } from '../middleware/async-database';
import * as uuidv4 from 'uuid/v4';
const router = express.Router();


router.route('/authorized')
  .post((req, res) => {
    let input:Inputs = {};
    let cart_uuid;

    db.query("SELECT * FROM users WHERE email = $1", [req.body.email])
      .then((result) => {
        console.log("first query")
        if (result.rows.length === 0) {
          throw new Error("Email not found")
        } else {
          input = result.rows[0];
          return bcrypt.compare(req.body.password, result.rows[0].password)
        }
      })
      .then((result) => {
        if (result === false) {
          throw new Error('Password incorrect');
        } else {
          return help.regenerateSession(req);
        }
      })
      .then(() => {
        return db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [req.sessionID, input.user_uuid]);
      })
      .then((result) => {
        return db.query('SELECT cart_uuid FROM cart WHERE user_uuid = $1', [input.user_uuid])
      })
      .then((result) => {
        cart_uuid = result.rows[0].cart_uuid;
        console.log('last query')
        req.session.user = {
          email:input.email,
          uuid:input.user_uuid,
          phone:input.phone,
          cart_uuid:cart_uuid
        }

        return req.db.query('select NOW()')
      })
      .then((result) => {
        req.db.release()
        console.log(result)


        res.render('home', {
          title:"yo",
          email:req.session.user.email
        })
      })
      .catch((error) => {
        console.log(error)
        res.render('login', { dbError: error })
      })
  })



router.post('/log-out', function(req, res, next) {
    let inactive = uuidv4(); //if its uuidv4 its inactive
    db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [inactive, req.session.user.uuid])
    .then((result) => {
      req.session.destroy(function(err:Error) {
        if (err) {
          res.render('error', { errName: err.message, errMessage: null });
        } else {
          console.log("after destory", req.session)
          res.render('login');
        }
      });
    })
  });


module.exports = router;
