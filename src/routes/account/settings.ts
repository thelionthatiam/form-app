import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as url from 'url';
import { deepMerge } from '../../functions/merge'
import { Inputs, PGOutput } from '../../../typings/typings';
import { db } from '../../middleware/database';
const router = express.Router();

router.route('/settings')
  .post((req, res) => {

  })
  .get((req,res) => {
    db.query('SELECT * FROM user_settings WHERE user_uuid = $1', [req.session.user.uuid])
      .then((result) => {
        let renderObj = deepMerge(result.rows[0], req.session.user)
        res.render('account/settings', renderObj)
      })
      .catch((error) => {
        console.log(error)
        res.redirect('/accounts/' + req.session.user.email + '/settings')
      })

  })

router.put('/settings/payment-scheme', (req, res) => {
  let input = [
    req.body.payment_scheme,
    req.session.user.uuid
  ];
  let query = 'UPDATE user_settings SET payment_scheme = $1 WHERE user_uuid = $2';

  db.query(query, input)
    .then((result) => {
      console.log(result);
      res.redirect('/accounts/' + req.session.user.email + '/settings')
    })
    .catch((error) => {
      console.log(error)
      res.redirect('/accounts/' + req.session.user.email + '/settings')
    })
})

router.put('/settings/monthly-max', (req, res) => {
  let input = [
    req.body.month_max,
    req.session.user.uuid
  ];
  let query = 'UPDATE user_settings SET month_max = $1 WHERE user_uuid = $2';
  let renderObj;

  db.query('SELECT * FROM user_settings WHERE user_uuid = $1', [req.session.user.uuid])
    .then((result) => {
      renderObj = deepMerge(result.rows[0], req.session.user)
      if (req.body.month_max < result.rows[0].dismiss_price) {
        throw new Error ('You should probably select a monthly max that is more than the dismiss price')
      } else {
        return   db.query(query, input)
      }
    })
    .then((result) => {
      console.log(result);
      res.redirect('/accounts/' + req.session.user.email + '/settings')
    })
    .catch((error) => {
      console.log(error)
      error = { error: error }
      renderObj = deepMerge(renderObj, error)
      res.render('account/settings', renderObj)
    })
})

router.put('/settings/price-per-snooze', (req, res) => {
  let input = [
    req.body.snooze_price,
    req.session.user.uuid
  ];
  let query = 'UPDATE user_settings SET snooze_price = $1 WHERE user_uuid = $2';
  let renderObj;

  db.query('SELECT * FROM user_settings WHERE user_uuid = $1', [req.session.user.uuid])
    .then((result) => {
      renderObj = deepMerge(result.rows[0], req.session.user)

      if (req.body.snooze_price > result.rows[0].dismiss_price) {
        throw new Error ('You should probably select a snooze price that is less than the dismiss price')
      } else {
        return db.query(query, input)
      }
    })
    .then((result) => {
      console.log(result);
      res.redirect('/accounts/' + req.session.user.email + '/settings')
    })
    .catch((error) => {
      console.log(error)
      error = { error: error }
      renderObj = deepMerge(renderObj, error)
      res.render('account/settings', renderObj)
    })
})


router.put('/settings/price-per-dismiss', (req, res) => {
  let input = [
    req.body.dismiss_price,
    req.session.user.uuid
  ];
  let query = 'UPDATE user_settings SET dismiss_price = $1 WHERE user_uuid = $2';
  let renderObj;

  db.query('SELECT * FROM user_settings WHERE user_uuid = $1', [req.session.user.uuid])
    .then((result) => {
      renderObj = deepMerge(result.rows[0], req.session.user)
      if (req.body.dismiss_price > result.rows[0].month_max) {
        throw new Error ('You should probably select a dismiss price that is less than the dismiss price')
      } else {
        return   db.query(query, input)
      }
    })
    .then((result) => {
      console.log(result);
      res.redirect('/accounts/' + req.session.user.email + '/settings')
    })
    .catch((error) => {
      console.log(error)
      error = { error: error }
      renderObj = deepMerge(renderObj, error)
      res.render('account/settings', renderObj)
    })
})


module.exports = router;
