"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const helper = require("../functions/helpers");
const bcrypt = require("bcrypt");
const database_1 = require("../middleware/database");
const router = express.Router();
//to sign up page
router.get('/new-account', function (req, res, next) {
    res.render('new-account', { success: false });
});
router.post('/delete', function (req, res, next) {
    res.render('login', {
        accountDelete: true,
    });
});
router.route('/accounts')
    .post((req, res) => {
    let inputs = {
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        uuid: '',
        nonce: ''
    };
    bcrypt.hash(inputs.password, 10)
        .then((hash) => {
        inputs.password = hash;
        let query = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';
        let input = [inputs.email, inputs.phone, inputs.password];
        return database_1.db.query(query, input);
    })
        .then((result) => {
        inputs.uuid = result.rows[0].user_uuid;
        return helper.randomString;
    })
        .then((string) => {
        return bcrypt.hash(string, 10);
    })
        .then((hash) => {
        inputs.nonce = hash;
        return database_1.db.query('INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2) RETURNING *', [inputs.uuid, inputs.nonce]);
    })
        .then((result) => {
        let query = 'INSERT INTO session (user_uuid, sessionID) VALUES ($1, $2)';
        let input = [inputs.uuid, req.sessionID];
        return database_1.db.query(query, input);
    })
        .then((result) => {
        return database_1.db.query('INSERT INTO cart (user_uuid) VALUES ($1) RETURNING *', [inputs.uuid]);
    })
        .then((result) => {
        console.log(result.rows);
        res.render('new-account', {
            success: true,
            email: inputs.email,
            phone: inputs.phone,
        });
    })
        .catch((err) => {
        console.log(err);
        res.render('new-account', {
            dbError: err.message
        });
    });
});
module.exports = router;
//# sourceMappingURL=accounts.js.map