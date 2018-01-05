"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const help = require("../functions/promise-helpers");
const bcrypt = require("bcrypt");
const async_database_1 = require("../middleware/async-database");
const router = express.Router();
router.route('/authorized')
    .post((req, res) => {
    var output = {};
    console.log('before', req.sessionID);
    async_database_1.db.query("SELECT * FROM users WHERE email = $1", [req.body.email])
        .then((result) => {
        if (result.rows.length === 0) {
            throw new Error("Email not found");
        }
        else {
            output = result.rows[0];
            return bcrypt.compare(req.body.password, result.rows[0].password);
        }
    })
        .then((result) => {
        if (result === false) {
            throw new Error('Password incorrect');
        }
        else {
            return help.regenerateSession(req);
        }
    })
        .then(() => {
        console.log(req.sessionID);
        console.log(output);
        req.session.user = {
            uuid: output.user_uuid,
            email: output.email,
            phone: output.phone,
        };
        // req.session.ID = uuidv4();
        res.render('home', {
            title: "yo",
            email: req.session.user.email
        });
    })
        .catch((error) => {
        res.render('login', { dbError: error });
    });
});
router.post('/log-out', function (req, res, next) {
    console.log("before destroy", req.session);
    req.session.destroy(function (err) {
        if (err) {
            res.render('error', { errName: err.message, errMessage: null });
        }
        else {
            console.log("after destory", req.session);
            res.render('login');
        }
    });
});
module.exports = router;
//# sourceMappingURL=authorization.js.map