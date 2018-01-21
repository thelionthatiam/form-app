"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const async_database_1 = require("../../middleware/async-database");
const router = express.Router();
//////////////
////////////// VARIABLES UNCHANGED
//////////////
router.route('/accounts')
    .get((req, res) => {
    let accountContent;
    let alarmContent;
    let alarmArray = [];
    let paymientContent;
    let paymentArray = [];
    async_database_1.db.query("SELECT * FROM users", [])
        .then((result) => {
        accountContent = result.rows;
        for (let i = 0; i < accountContent.length; i++) {
            alarmArray.push(async_database_1.db.query('SELECT * FROM alarms WHERE user_uuid = $1', [accountContent[i].user_uuid]));
        }
        return Promise.all(alarmArray);
    })
        .then((result) => {
        for (let i = 0; i < result.length; i++) {
            accountContent[i].alarmContent = result[i].rows;
        }
        for (let i = 0; i < accountContent.length; i++) {
            paymentArray.push(async_database_1.db.query('SELECT * FROM payment_credit WHERE user_uuid = $1', [accountContent[i].user_uuid]));
        }
        return Promise.all(paymentArray);
    })
        .then((result) => {
        for (let i = 0; i < result.length; i++) {
            accountContent[i].paymentContent = result[i].rows;
        }
        res.render('admin/accounts/accounts', {
            accountContent: accountContent
        });
    })
        .catch((err) => {
        console.log(err);
        res.render('error', {
            errName: err.message,
            errMessage: null
        });
    });
});
router.get('/new-account', (req, res, next) => {
    // res.render('admin/products/new-product', {
    //   //
    // })
});
router.route('/accounts/:user_uuid')
    .delete((req, res) => {
    let user_uuid = req.body.user_uuid;
    async_database_1.db.query('DELETE FROM users WHERE user_uuid = $1', [user_uuid])
        .then((result) => {
        res.redirect('/admin/accounts');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('error', { dbError: err.stack });
    });
});
router.post('/gather-id', (req, res) => {
    console.log('gather id');
    req.session.admin.user_uuid = req.body.user_uuid;
    res.render('alarms/new-alarm', {
        email: req.body.user_uuid
    });
});
module.exports = router;
//# sourceMappingURL=accounts.js.map