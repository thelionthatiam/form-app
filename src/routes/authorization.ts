import * as express from 'express';
import * as help from '../functions/promise-helpers';
import * as helper from '../functions/helpers';
import * as bcrypt from 'bcrypt';
import * as url from 'url';
import { Inputs, PGOutput, ModRequest } from '../../typings/typings';
import { db } from '../middleware/async-database';
import * as uuidv4 from 'uuid/v4';
const router = express.Router();


router.route('/authorized')
  .post((req, res) => {
    var output = {};
    console.log('before', req.sessionID);
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
          return help.regenerateSession(req);
        }
      })
      .then(() => {
        return db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [req.sessionID, output.user_uuid]);
      })
      .then((result) => {
        console.log(req.sessionID)

        req.session.user = {
          uuid:output.user_uuid,
          email:output.email,
          phone:output.phone,
        }
        // req.session.ID = uuidv4();
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
    console.log("before destroy", req.session)
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
