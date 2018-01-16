"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promise_helpers_1 = require("../functions/promise-helpers");
const express = require("express");
const async_database_1 = require("../middleware/async-database");
const mail_config_js_1 = require("../config/mail-config.js");
const router = express.Router();
router.route('/orders')
    .post((req, res) => {
    console.log('post purchase');
    let card_number = req.body.card_number;
    let order_uuid = '';
    let numberOfOrders = 0;
    async_database_1.db.query('SELECT * FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid])
        .then((result) => {
        if (result.rowCount === 0) {
            res.redirect('/accounts/' + req.session.user.email + '/cart');
        }
        else {
            return async_database_1.db.query('SELECT * FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid]);
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
        return async_database_1.db.query('SELECT product_id, quantity FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid]);
    })
        .then((result) => {
        let cart_items = promise_helpers_1.addOrderUUIDItemNumber(result.rows, order_uuid);
        console.log('cartitems', cart_items);
        let sqlVariables = promise_helpers_1.queryVariables(cart_items);
        let values = promise_helpers_1.inputs(cart_items);
        let query = promise_helpers_1.concatQuery(sqlVariables);
        console.log(query, values);
        return async_database_1.db.query(query, values);
    })
        .then((result) => {
        return async_database_1.db.query('DELETE FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid]);
    })
        .then((result) => {
        let query = 'SELECT p.product_id, name, price, size, description, quantity FROM products p INNER JOIN order_items o ON p.product_id = o.product_id AND (o.order_uuid = $1)';
        let input = [order_uuid];
        return async_database_1.db.query(query, input);
    })
        .then((result) => {
        var mailInvoice = {
            from: 'juliantheberge@gmail.com',
            to: req.session.user.email,
            subject: 'Recent Purchse from Alarm App',
            text: promise_helpers_1.stringifyQueryOutput(result.rows)
        };
        return mail_config_js_1.transporter.sendMail(mailInvoice);
    })
        .then((result) => {
        console.log(result);
        res.render('order-sent', {
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