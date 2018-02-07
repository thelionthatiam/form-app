import * as express from 'express';
import { lastFourOnly, dbErrTranslator, compare } from '../../functions/helpers'
import * as coupons from '../../functions/coupon'
import { db } from '../../middleware/database';
const router = express.Router();

let viewPrefix = 'cart/'

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
      cart_uuid:'',
      card_number:'',
      product_history_id:''
    }
    console.log('post to cart')
    db.query('SELECT card_number FROM payment_credit WHERE (user_uuid, active) = ($1, $2)', [inputs.uuid, true])
      .then((result) => {
        inputs.card_number = result.rows[0].card_number;

        return db.query('SELECT cart_uuid FROM cart WHERE user_uuid = $1', [req.session.user.uuid])
      })
      .then((result) => {
        inputs.cart_uuid = result.rows[0].cart_uuid;
        return db.query('SELECT product_history_id FROM product_history p WHERE updated_timestamp = (SELECT MAX(updated_timestamp) FROM product_history WHERE product_id = $1)', [inputs.product_id])
      })
      .then((result) => {
        inputs.product_history_id = result.rows[0].product_history_id;
        return db.query('SELECT product_id FROM cart_items WHERE cart_uuid = $1 and product_id = $2', [inputs.cart_uuid, inputs.product_id])
      })
      .then((result) => {
        if (result.rows.length === 0) {
          db.query('SELECT cc.coupon_uuid, discount, applies_to, applied FROM cart_coupons cc INNER JOIN coupons c ON c.coupon_uuid = cc.coupon_uuid AND (cc.cart_uuid = $1)', [req.session.user.cart_uuid])
            .then((result) => {
              if (result.rows[0].applied === true && (result.rows[0].applies_to === inputs.product_id || result.rows[0].applies_to === 'order')) {
                let query = 'INSERT INTO cart_items(product_id, cart_uuid, quantity, product_history_id, discount) VALUES ($1, $2, $3, $4, $5)';
                let input = [inputs.product_id, inputs.cart_uuid, inputs.quantity, inputs.product_history_id, result.rows[0].discount];
                return db.query(query, input);
              } else {
                let query = 'INSERT INTO cart_items(product_id, cart_uuid, quantity, product_history_id) VALUES ($1, $2, $3, $4)';
                let input = [inputs.product_id, inputs.cart_uuid, inputs.quantity, inputs.product_history_id];
                return db.query(query, input);
              }
            })
        } else {
          let query = 'UPDATE cart_items SET quantity = quantity+$1 WHERE cart_uuid = $2 AND product_id = $3';
          let input = [inputs.quantity, inputs.cart_uuid, inputs.product_id];
          return db.query(query, input);
        }
      })
      .then((result) => {
        res.redirect('../../products')
      })
      .catch((err) => {
        console.log(err);
        let userError = dbErrTranslator(err.message)
        res.render('shopping/products', { dbError: userError });
      });
  })
  .get((req, res) => {
    let uuid = req.session.user.uuid,
        cartContent:any[] = [],
        totalCost = 0,
        totalItems = 0,
        price,
        quantity,
        card_number:string,
        lastFour:string,
        discounted:number = 1;

    db.query('SELECT p.product_id, name, price, size, description FROM products p INNER JOIN cart_items c ON p.product_id = c.product_id AND (c.cart_uuid = $1)', [req.session.user.cart_uuid])
      .then((result) => {
        cartContent = result.rows
        for (let i = 0; i < cartContent.length; i++) {
          cartContent[i].email = req.session.user.email;
        }
        return db.query('SELECT * FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
      })
      .then((result) => {
        for (let i = 0; i < cartContent.length; i++) {
          for (let j = 0; j < result.rows.length; j++) {
            if (cartContent[i].product_id === result.rows[j].product_id) {
              cartContent[i].quantity = result.rows[j].quantity
            }
          }
          let discounted = coupons.percentOff(result.rows[i].discount, cartContent[i].price)
          console.log(discounted)
          price = discounted;
          quantity = parseInt(cartContent[i].quantity);
          totalCost = totalCost + (price * quantity);
          totalItems = totalItems + quantity;
          console.log(price, quantity, totalCost, totalItems)
        }
        return db.query('SELECT card_number FROM cart WHERE user_uuid = $1', [req.session.user.uuid])
      })
      .then((result) => {
        lastFour = lastFourOnly(result.rows[0].card_number);
        card_number = result.rows[0].card_number;

        return db.query('SELECT * FROM users', []);

      })
      .then((result) => {

        res.render(viewPrefix + 'cart', {
          cartContent:cartContent,
          totalCost:totalCost,
          totalItems:totalItems,
          lastFour:lastFour,
          card_number:card_number,
          email:req.session.user.email,
        })
      })
      .catch((err) => {
        console.log('get cart error', err);
        let userError = dbErrTranslator(err.message)
        res.render(viewPrefix + 'cart', { dbError: userError });
      });
  })

router.route('/cart/:product_id')
  .get((req, res) => {
    let cart_uuid = req.session.user.cart_uuid;
    db.query('SELECT * FROM cart_items WHERE cart_uuid = $1 AND product_id = $2', [cart_uuid, req.query.product_id])
      .then((result) => {
        res.render(viewPrefix + 'edit-cart-item', {
          name: result.rows[0].name,
          product_id: result.rows[0].product_id,
          quantity: result.rows[0].quantity,
          uuid: cart_uuid,
          email:req.session.user.email
        })
      })
      .catch((err) => {
        console.log(err.stack)
        res.render(viewPrefix + 'cart', { dbError: err.stack });
      });
  })
  .put((req, res) => {
    let quantity = parseInt(req.body.quantity);
    let product_id = req.body.product_id;
    let cart_uuid = req.session.user.cart_uuid;
    if (req.body.quantity === 0) {
      db.query('DELETE FROM cart_items WHERE product_id = $1 AND cart_uuid = $2', [req.query.product_id, cart_uuid])
        .then((result) => {
          res.redirect('/acccounts/:email/cart');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render(viewPrefix + 'cart', { dbError: err.stack });
        });
    }
    db.query('UPDATE cart_items SET quantity = $1 WHERE cart_uuid = $2 AND product_id = $3', [quantity, cart_uuid, product_id])
      .then((result) => {
        res.redirect('/accounts/' + req.session.user.email + '/cart');
      })
      .catch((err) => {
        console.log(err.stack)
        res.render(viewPrefix + 'cart', { dbError: err.stack });
      });
  })
  .delete((req, res) => {
    let cart_uuid = req.session.user.cart_uuid;
    db.query('DELETE FROM cart_items WHERE product_id = $1 AND cart_uuid = $2', [req.body.product_id, cart_uuid])
      .then((result) => {
        res.redirect('/accounts/' + req.session.user.email + '/cart');
      })
      .catch((err) => {
        console.log(err.stack);
        res.render(viewPrefix + 'cart', { dbError: err.stack });
      });
  })

router.route('/payment-select')
  .get((req, res) => {
    let uuid = req.session.user.uuid;
    let paymentContent:any[];
    db.query("SELECT * FROM payment_credit WHERE user_uuid = $1", [uuid])
      .then((result) => {
        paymentContent = result.rows
        return db.query('SELECT card_number FROM cart WHERE user_uuid = $1', [req.session.user.uuid])
      })
      .then((result) => {
        let lastFour = lastFourOnly(result.rows[0].card_number);

        res.render(viewPrefix + 'payments-cart-select', {
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
        res.render(viewPrefix + 'payments-cart-select', {
          dbError:error
        })
      })
  })

module.exports = router;
