import { lastFourOnly, addOrderUUIDItemNumber } from '../../functions/helpers';
import * as coupons from '../../functions/coupon'
import * as inv from '../../functions/invoice';
import * as express from 'express';
import { db } from '../../middleware/database';
import * as mailer from '../../middleware/emailer'
const router = express.Router();

router.use('/orders', mailer.mailer()) // middleware to load email junk

router.route('/orders')
  .post((req, res) => {
    let card_number = req.body.card_number;
    let order_uuid = '';
    let numberOfOrders = 0;
    let discount:number;
    let recieptContent;

    db.query('SELECT * FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
      .then((result) => {
        if (result.rowCount === 0) {
          res.redirect('/accounts/' + req.session.user.email + '/cart');
        } else {
          return db.query('SELECT * FROM orders WHERE user_uuid = $1', [req.session.user.uuid])
        }
      })
      .then((result) => {
        let number = result.rows.length;
        numberOfOrders = number + 1;

        let query = 'INSERT INTO orders (user_uuid, card_number, order_number) VALUES ($1, $2, $3)';
        let input = [req.session.user.uuid, card_number, numberOfOrders];
        return db.query(query, input)
      })
      .then((result) => {
        let query = 'SELECT order_uuid FROM orders WHERE user_uuid = $1 AND order_number = $2';
        let input = [req.session.user.uuid, numberOfOrders];
        return db.query(query, input)
      })
      .then((result) => {
        order_uuid = result.rows[0].order_uuid;
        return db.query('SELECT product_id, quantity, product_history_id, discount FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
      })
      .then((result) => {
        discount = result.rows[0].discount
        let cart_items = addOrderUUIDItemNumber(result.rows, order_uuid);
        let query = 'INSERT INTO order_items (product_id, quantity, product_history_id, discount, order_uuid, item_number) VALUES ($1, $2, $3, $4, $5, $6)'
        let itemArray:any[] = [];
        for (let i = 0; i < cart_items.length; i++) {
          let itemProperties:any[] = [
            cart_items[i].product_id,
            cart_items[i].quantity,
            cart_items[i].product_history_id,
            cart_items[i].discount,
            cart_items[i].order_uuid,
            cart_items[i].item_number
          ]
          itemArray.push(db.query(query, itemProperties))
        }
        return Promise.all(itemArray);

      })
      .then((result) => {
        return db.query('DELETE FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
      })
      .then((result) => {
        let query = 'SELECT p.product_id, name, price, size, description, quantity, discount FROM products p INNER JOIN order_items o ON p.product_id = o.product_id AND (o.order_uuid = $1)';
        let input = [order_uuid];
        return db.query(query, input)
      })
      .then((result) => {
        recieptContent = result.rows;
        let totalQuantity =  inv.totalItems(recieptContent)
        recieptContent = inv.addDiscount(recieptContent);
        recieptContent = inv.addEmail(recieptContent, req.session.user.email);
        let total = coupons.percentOff(discount, inv.total(inv.invoiceItems(result.rows))).toString();

        let  mail = {
                    from: 'juliantheberge@gmail.com',
                    to: 'fffff@mailinator.com',
                    subject: 'Test',
                    template: 'email/reciept',
                    context: {
                      cartContent:recieptContent,
                      totalCost:total,
                      totalItems:totalQuantity,
                      lastFour:'fake card',
                      email:req.session.user.email,
                    }
                };

        return req.transporter.sendMail(mail)
      })
      .then((info) => {
        return db.query('UPDATE cart_coupons SET used = $1', [true])
      })
      .then((result) => {
        res.render('orders/order-sent', {
          email:req.session.user.email
        })
      })
      .catch((error) => {
        console.log(error)
        res.send(error);
      })
  })


module.exports = router;
