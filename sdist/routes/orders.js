"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_helpers_1 = require("../functions/promise-helpers");
const coupons = require("../functions/coupon-helpers");
const inv = require("../functions/invoice");
const express = require("express");
const async_database_1 = require("../middleware/async-database");
const mailer = require("../middleware/emailer");
const router = express.Router();
router.use('/orders', mailer.mailer()); // middleware to load email junk
router.route('/orders')
    .post((req, res) => {
    let card_number = req.body.card_number;
    let order_uuid = '';
    let numberOfOrders = 0;
    let discount;
    let recieptContent;
    async_database_1.db.query('SELECT * FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
        .then((result) => {
        if (result.rowCount === 0) {
            res.redirect('/accounts/' + req.session.user.email + '/cart');
        }
        else {
            return async_database_1.db.query('SELECT * FROM orders WHERE user_uuid = $1', [req.session.user.uuid]);
        }
    })
        .then((result) => {
        let number = result.rows.length;
        numberOfOrders = number + 1;
        let query = 'INSERT INTO orders (user_uuid, card_number, order_number) VALUES ($1, $2, $3)';
        let input = [req.session.user.uuid, card_number, numberOfOrders];
        return async_database_1.db.query(query, input);
    })
        .then((result) => {
        let query = 'SELECT order_uuid FROM orders WHERE user_uuid = $1 AND order_number = $2';
        let input = [req.session.user.uuid, numberOfOrders];
        return async_database_1.db.query(query, input);
    })
        .then((result) => {
        order_uuid = result.rows[0].order_uuid;
        console.log('order uuid', order_uuid);
        return async_database_1.db.query('SELECT product_id, quantity, product_history_id, discount FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid]);
    })
        .then((result) => {
        discount = result.rows[0].discount;
        let cart_items = promise_helpers_1.addOrderUUIDItemNumber(result.rows, order_uuid);
        let sqlVariables = promise_helpers_1.queryVariables(cart_items);
        let values = promise_helpers_1.inputs(cart_items);
        let query = promise_helpers_1.concatQuery(sqlVariables);
        return async_database_1.db.query(query, values);
    })
        .then((result) => {
        return async_database_1.db.query('DELETE FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid]);
    })
        .then((result) => {
        let query = 'SELECT p.product_id, name, price, size, description, quantity, discount FROM products p INNER JOIN order_items o ON p.product_id = o.product_id AND (o.order_uuid = $1)';
        let input = [order_uuid];
        return async_database_1.db.query(query, input);
    })
        .then((result) => {
        recieptContent = result.rows;
        let totalQuantity = inv.totalItems(recieptContent);
        recieptContent = inv.addDiscount(recieptContent);
        recieptContent = inv.addEmail(recieptContent, req.session.user.email);
        let items = promise_helpers_1.stringifyQueryOutput(inv.invoiceItems(result.rows));
        let total = coupons.percentOff(discount, inv.total(inv.invoiceItems(result.rows))).toString();
        let mail = {
            from: 'juliantheberge@gmail.com',
            to: 'fffff@mailinator.com',
            subject: 'Test',
            template: 'email/reciept',
            context: {
                cartContent: recieptContent,
                totalCost: total,
                totalItems: totalQuantity,
                lastFour: 'fake card',
                email: req.session.user.email,
            }
        };
        return req.transporter.sendMail(mail);
    })
        .then((info) => {
        console.log(info);
        return async_database_1.db.query('UPDATE cart_coupons SET used = $1', [true]);
    })
        .then((result) => {
        res.render('orders/order-sent', {
            email: req.session.user.email
        });
    })
        .catch((error) => {
        console.log(error);
        res.send(error);
    });
});
module.exports = router;
//# sourceMappingURL=orders.js.map