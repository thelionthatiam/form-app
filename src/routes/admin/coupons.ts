import { dbErrTranslator, compare } from '../../functions/helpers';
import * as express from 'express';
import { db } from '../../middleware/async-database';
const router = express.Router();

let cpn = {
  name:'',
  description:'',
  discount:0,
  expires_on:'',
  applies_to:'',
  uuid:''
}


router.route('/coupons')
  .post((req, res) => {
    cpn.name = req.body.name;
    cpn.description = req.body.description;
    cpn.discount = req.body.discount;
    cpn.expires_on = req.body.expires_on;
    cpn.applies_to = req.body.applies_to;

    let query = 'INSERT INTO coupons(name, description, discount, expires_on, applies_to) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    let input = [cpn.name, cpn.description, cpn.discount, cpn.expires_on, cpn.applies_to];

    db.query(query, input)
      .then((result) => {
        res.redirect('/admin/coupons');
      })
      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render('error', { dbError: userError });
      });
  })
  .get((req, res) => {
    db.query("SELECT * FROM coupons", [])
      .then((result) => {
        let couponContent = result.rows
        res.render('admin/coupons/coupons', {
          couponContent:couponContent
        })
      })
      .catch((err) => {
        console.log(err)
        res.render('error', {
          errName: err.message,
          errMessage: null
        });
      });
  })

router.get('/new-coupon', (req, res, next) => {
  res.render('admin/coupons/new-coupon', {
    //
  })
})



router.route('/coupons/:uuid')
  .get((req, res) => {
    let uuid = req.query.uuid;

    db.query("SELECT * FROM coupons WHERE coupon_uuid = $1", [uuid])
      .then((result) => {
        let coupon = result.rows[0]

        cpn.uuid = uuid;
        cpn.name = coupon.name;
        cpn.description = coupon.description;
        cpn.discount = coupon.discount;
        cpn.expires_on = coupon.expires_on;
        cpn.applies_to = coupon.applies_to;

        res.render('admin/coupons/edit-coupon', cpn)
      })
      .catch((err) => {
        console.log(err.stack);
        res.render('error', { dbError: err.stack });
      });
    })
    .put((req, res) => {

      cpn.name = req.body.name;
      cpn.description = req.body.description;
      cpn.discount = req.body.discount;
      cpn.expires_on = req.body.expires_on;
      cpn.applies_to = req.body.applies_to;
      cpn.uuid = req.body.uuid;


      let query = 'UPDATE coupons SET (name, description, discount, expires_on, applies_to) = ($1, $2, $3, $4, $5, $6, $7) WHERE coupon_uuidname = $8';
      let input = [cpn.name, cpn.description, cpn.discount, cpn.expires_on, cpn.applies_to, cpn.uuid]
      db.query(query, input)
        .then((result) => {
          res.redirect('/admin/coupons');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })
    .delete((req, res) => {
      cpn.uuid = req.body.uuid;

      db.query('DELETE FROM coupons WHERE coupon_uuid = $1', [cpn.uuid])
        .then((result) => {
          res.redirect('/admin/coupons');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })

router.post('/coupons/issue-coupon', (req,res) => {
  let coupon_uuid = req.body.uuid;
  db.query('SELECT cart_uuid FROM cart', [])
    .then((result) => {
      let cart_uuids = result.rows
      let promiseArray = []
      for (let i = 0; i < cart_uuids.length; i++) {
        promiseArray.push(db.query('INSERT INTO cart_coupons(coupon_uuid, cart_uuid) VALUES ($1, $2)', [coupon_uuid, cart_uuids[i].cart_uuid]))
      }

      return Promise.all(promiseArray);
    })
    .then((result) => {
      console.log(result)
      res.redirect('admin/coupons');
    })
    .catch((error) => {
      console.log(error)
      res.render('error')
    })
})

module.exports = router;
