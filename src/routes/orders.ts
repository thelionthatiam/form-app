import { dbErrTranslator, compare } from '../functions/helpers';
import { lastFourOnly, queryVariables, inputs, concatQuery, addOrderUUIDItemNumber, stringifyQueryOutput } from '../functions/promise-helpers'
import * as express from 'express';
import { db } from '../middleware/async-database';
import { transporter, mailOptions } from "../config/mail-config.js";
const router = express.Router();

router.route('/orders')
  .post((req, res) => {
    console.log('post purchase')
    let card_number = req.body.card_number;
    let order_uuid = '';
    let numberOfOrders = 0;

    db.query('SELECT * FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
      .then((result) => {
        if (result.rowCount === 0) {
          res.redirect('/accounts/' + req.session.user.email + '/cart');
        } else {
          return db.query('SELECT * FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
        }
      })
      .then((result) => {
        let number = result.rows.length;
        numberOfOrders = number + 1;
        return db.query('INSERT INTO orders (user_uuid, card_number, order_number) VALUES ($1, $2, $3)', [req.session.user.uuid, card_number, numberOfOrders])
      })
      .then((result) => {
        return db.query('SELECT order_uuid FROM orders WHERE user_uuid = $1 AND order_number = $2', [req.session.user.uuid, numberOfOrders])
      })
      .then((result) => {
        order_uuid = result.rows[0].order_uuid;
        return db.query('SELECT product_id, quantity FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
      })
      .then((result) => {
        let cart_items = addOrderUUIDItemNumber(result.rows, order_uuid);
        console.log('cartitems', cart_items)
        let sqlVariables = queryVariables(cart_items);
        let values = inputs(cart_items);
        let query = concatQuery(sqlVariables);
        console.log(query, values)
        return db.query(query, values);
      })
      .then((result) => {
        return db.query('DELETE FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
      })
      .then((result) => {
        return db.query('SELECT p.product_id, name, price, size, description, quantity FROM products p INNER JOIN order_items o ON p.product_id = o.product_id AND (o.order_uuid = $1)', [order_uuid])
      })
      .then((result) => {
        var mailInvoice = {
          from: 'juliantheberge@gmail.com',
          to: req.session.user.email,
          subject: 'Recent Purchse from Alarm App',
          text: stringifyQueryOutput(result.rows)
        };
        return transporter.sendMail(mailInvoice)
      })
      .then((result) => {
        console.log(result);
        res.render('order-sent', {
          email:req.session.user.email
        })
      })
      .catch((error) => {
        console.log(error)
        res.send(error);
      })
  })

module.exports = router;
