import { dbErrTranslator, compare } from '../functions/helpers';
import { lastFourOnly } from '../functions/promise-helpers'
import * as express from 'express';
import { db } from '../middleware/async-database';
const router = express.Router();


router.route('/cart')
  .post((req, res) => {
    let product = req.body.product.split(',');
    let inputs = {
      product_id:product[0],
      name:product[1],
      price:product[2],
      size:product[3],
      uuid: req.session.user.uuid,
      quantity: req.body.quantity,
      card_number:''
    }
    db.query('SELECT card_number FROM payment_credit WHERE (user_uuid, active) = ($1, $2)', [inputs.uuid, true])
      .then((result) => {
        inputs.card_number = result.rows[0].card_number

        return db.query('SELECT product_id FROM cart WHERE user_uuid = $1 and product_id = $2', [inputs.uuid, inputs.product_id])
      })
      .then((result) => {
        if (result.rows.length === 0) {
          return db.query('INSERT INTO cart(product_id, name, price, size, user_uuid, quantity, card_number) VALUES ($1, $2, $3, $4, $5, $6, $7)', [inputs.product_id, inputs.name, inputs.price, inputs.size, inputs.uuid, inputs.quantity, inputs.card_number])
        } else {
          return db.query('UPDATE cart SET quantity = quantity+$1 WHERE user_uuid = $2', [inputs.quantity, inputs.uuid])
        }
      })
      .then((result) => {
        res.redirect('../../products')
      })
      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render('products', { dbError: userError });
      });

  })
  .get((req, res) => {
    let uuid = req.session.user.uuid,
        cartContent = [],
        totalCost = 0,
        totalItems = 0,
        price,
        quantity;
    db.query('SELECT * FROM cart WHERE user_uuid = $1', [uuid])
      .then((result) => {
        cartContent = result.rows
        for (let i = 0; i < result.rows.length; i++) {
          price = parseInt(result.rows[i].price);
          quantity = parseInt(result.rows[i].quantity);
          totalCost = totalCost + (price*quantity);
          totalItems = totalItems + quantity;
        }
        let lastFour = lastFourOnly(result.rows[0].card_number);
        // return db.query('UPDATE cart SET card_number = $1 WHERE (user_uuid, active) = ($1, $2)')
        res.render('cart', {
          cartContent:cartContent,
          totalCost:totalCost,
          totalItems:totalItems,
          card_number:lastFour,
          email:req.session.user.email
        })
      })
      .catch((err) => {
        console.log('get cart error', err);
        let userError = dbErrTranslator(err.message)
        res.render('cart', { dbError: userError });
      });
  })

router.route('/cart/:product_id')
  .get((req, res) => {
    let uuid = req.session.user.uuid
    db.query('SELECT * FROM cart WHERE user_uuid = $1 AND product_id = $2', [uuid, req.query.product_id])
      .then((result) => {
        res.render('edit-cart-item', {
          name: result.rows[0].name,
          product_id: result.rows[0].product_id,
          quantity: result.rows[0].quantity,
          uuid:uuid
        })
      })
      .catch((err) => {
        console.log(err.stack)
        res.render('cart', { dbError: err.stack });
      });
  })
  .put((req, res) => {
    let quantity = parseInt(req.body.quantity);
    let product_id = req.body.product_id;
    let uuid = req.session.user.uuid;
    if (req.body.quantity === 0) { // run delete
      db.query('DELETE FROM cart WHERE product_id = $1 AND user_uuid = $2', [req.query.product_id, uuid])
        .then((result) => {
          res.redirect('/acccounts/:email/cart');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('cart', { dbError: err.stack });
        });
    }
    db.query('UPDATE cart SET quantity = $1 WHERE user_uuid = $2 AND product_id = $3', [quantity, uuid, product_id])
      .then((result) => {
        res.redirect('/accounts/' + req.session.user.email + '/cart');
      })
      .catch((err) => {
        console.log(err.stack)
        res.render('cart', { dbError: err.stack });
      });
  })
  .delete((req, res) => {
    let uuid = req.session.user.uuid
    db.query('DELETE FROM cart WHERE product_id = $1 AND user_uuid = $2', [req.body.product_id, uuid])
      .then((result) => {
        res.redirect('/accounts/' + req.session.user.email + '/cart');
      })
      .catch((err) => {
        console.log(err.stack);
        res.render('cart', { dbError: err.stack });
      });
  })

router.route('/payment-select')
  .get((req, res) => {
    let uuid = req.session.user.uuid;
    let paymentContent;
    db.query("SELECT * FROM payment_credit WHERE user_uuid = $1", [uuid])
      .then((result) => {
        paymentContent = result.rows
        return db.query('SELECT card_number FROM cart WHERE user_uuid = $1', [req.session.user.uuid])
      })
      .then((result) => {
        console.log(result)
        let lastFour = lastFourOnly(result.rows[0].card_number);

        res.render('payments-cart-select', {
          paymentContent:paymentContent,
          activeCard:lastFour,
          email:req.session.user.email
        })
      })
      .catch((error) => {
        console.log(error)
        res.redirect('./cart')
      })
  })
  .post((req, res) => {
    let card_number = req.body.card_number
    db.query('UPDATE cart SET card_number = $1 WHERE user_uuid = $2', [card_number, req.session.user.uuid])
      .then((result) => {
        res.redirect('/accounts/' + req.session.user.email + '/cart')
      })
      .catch((error) => {
        console.log(error)
        res.render('payments-cart-select', {
          dbError:error
        })
      })
  })

module.exports = router;
