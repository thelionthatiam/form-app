"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const async_database_1 = require("../middleware/async-database");
const router = express.Router();
router.route('/coupons')
    .post((req, res) => {
    // admin side
})
    .get((req, res) => {
    let couponContent = [];
    async_database_1.db.query('SELECT c.coupon_uuid, name, expires_on, description, discount, applied, used FROM coupons c inner JOIN cart_coupons cc ON c.coupon_uuid = cc.coupon_uuid AND (cart_uuid = $1) AND (used = $2)', [req.session.user.cart_uuid, false])
        .then((result) => {
        couponContent = result.rows;
        for (let i = 0; i < couponContent.length; i++) {
            couponContent[i].email = req.session.user.email;
            if (result.rows[i].used === true) {
                couponContent = result.rows.filter(e => e !== result.rows[i]);
            }
        }
        res.render('coupons/coupons', {
            couponContent: couponContent,
            email: req.session.user.email
        });
    })
        .catch((error) => {
        console.log(error);
        res.redirect('/accounts/' + req.session.user.email + '/cart');
    });
});
router.route('/coupons/:coupon_uuid') // need to do off case
    .put((req, res) => {
    let couponID = req.body.coupon_uuid;
    let discount = 1;
    console.log(true, req.session.user.cart_uuid, couponID);
    async_database_1.db.query('UPDATE cart_coupons SET applied = $1 WHERE cart_uuid = $2 AND coupon_uuid = $3', [true, req.session.user.cart_uuid, couponID])
        .then((result) => {
        return async_database_1.db.query('SELECT discount FROM coupons WHERE coupon_uuid = $1', [couponID]);
    })
        .then((result) => {
        discount = result.rows[0].discount;
        return async_database_1.db.query('UPDATE cart_items SET discount = $1 WHERE cart_uuid = $2', [discount, req.session.user.cart_uuid]);
    })
        .then((result) => {
        res.redirect('/accounts/' + req.session.user.email + '/coupons');
    })
        .catch((error) => {
        console.log(error);
        res.redirect('/accounts/' + req.session.user.email + '/cart');
    });
});
module.exports = router;
//# sourceMappingURL=coupons.js.map