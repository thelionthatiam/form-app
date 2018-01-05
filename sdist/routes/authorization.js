"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const help = require("../functions/promise-helpers");
const bcrypt = require("bcrypt");
const async_database_1 = require("../middleware/async-database");
const uuidv4 = require("uuid/v4");
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
        return async_database_1.db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [req.sessionID, output.user_uuid]);
    })
        .then((result) => {
        console.log(req.sessionID);
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
        console.log(error);
        res.render('login', { dbError: error });
    });
});
router.post('/log-out', function (req, res, next) {
    console.log("before destroy", req.session);
    let inactive = uuidv4(); //if its uuidv4 its inactive
    async_database_1.db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [inactive, req.session.user.uuid])
        .then((result) => {
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
});
module.exports = router;
//# sourceMappingURL=authorization.js.map