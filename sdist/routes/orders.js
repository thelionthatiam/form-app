"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const async_database_1 = require("../middleware/async-database");
const router = express.Router();
function queryVariables(result) {
    let tempField = [];
    let finalField = [];
    for (let j = 0; j < result.length; j++) {
        console.log(result.length);
        tempField.push('(');
        for (let i = 1; i <= 6; i++) {
            if (i < 6) {
                tempField.push('$' + [i + (j * 6)] + ', ');
            }
            else {
                tempField.push('$' + [i + (j * 6)]);
            }
        }
        tempField.push(')');
        finalField.push(tempField.join(''));
        tempField = [];
    }
    return finalField.join(', ');
}
function inputs(result, order_uuid) {
    let tempArray = [];
    for (let i = 0; i < result.length; i++) {
        tempArray.push(order_uuid);
        for (let k in result[i]) {
            if (k === 'order_uuid') {
                // console.log('order_uuid', k, result[i][k])
                tempArray.push(result[i][k]);
            }
            else if (k === 'product_id') {
                // console.log('product_it', k, result[i][k])
                tempArray.push(result[i][k]);
            }
            else if (k === 'price') {
                // console.log('price', k, result[i][k])
                tempArray.push(result[i][k]);
            }
            else if (k === 'quantity') {
                // console.log('quantity', k, result[i][k])
                tempArray.push(result[i][k]);
            }
            else if (k === 'name') {
                // console.log('name', k, result[i][k])
                tempArray.push(result[i][k]);
            }
            else if (k === 'size') {
                // console.log('size', k, result[i][k])
                tempArray.push(result[i][k]);
            }
        }
    }
    return tempArray;
}
function concatQuery(sqlVariables) {
    return "INSERT INTO order_items (order_uuid, product_id, price, quantity, name, size) VALUES " + sqlVariables;
}
router.route('/orders')
    .post((req, res) => {
    console.log('post purchase');
    let card_number = req.body.card_number;
    let order_uuid = '';
    async_database_1.db.query('INSERT INTO orders (cart_uuid, card_number) VALUES ($1, $2)', [req.session.user.cart_uuid, card_number])
        .then((result) => {
        console.log('result of insert into orders', result);
        return async_database_1.db.query('SELECT order_uuid FROM orders WHERE cart_uuid = $1', [req.session.user.cart_uuid]);
    })
        .then((result) => {
        console.log('select order_uuid', result);
        order_uuid = result.rows[0].order_uuid;
        return async_database_1.db.query('SELECT * FROM cart_items WHERE cart_uuid = $1', [req.session.user.cart_uuid]);
    })
        .then((result) => {
        console.log(order_uuid);
        let cart_items = result.rows;
        let sqlVariables = queryVariables(cart_items);
        let values = inputs(cart_items, order_uuid);
        let query = concatQuery(sqlVariables);
        console.log('inputs', inputs);
        console.log(query, values);
        return async_database_1.db.query(query, values);
    })
        .then((result) => {
        // eventually send mail
        // empty cart
        res.render('order-sent');
    })
        .catch((error) => {
        console.log(error);
        res.send(error);
    });
});
module.exports = router;
//# sourceMappingURL=orders.js.map