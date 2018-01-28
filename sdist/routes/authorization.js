"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const help = require("../functions/promise-helpers");
const bcrypt = require("bcrypt");
const async_database_1 = require("../middleware/async-database");
const uuidv4 = require("uuid/v4");
const test_1 = require("./test");
const resources_1 = require("../config/resources");
const router = express.Router();
class AuthHandler extends test_1.BaseReqestHandler {
    constructor(req, res, query, input, nextPage, errPage, money) {
        super(req, res, query, input, nextPage, errPage); // must have parent constructor
        this.userSelect = 'SELECT * FROM users WHERE email = $1';
        this.updateSessionID = 'UPDATE session SET sessionid = $1 WHERE user_uuid = $2';
        this.selectCartID = 'SELECT cart_uuid FROM cart WHERE user_uuid = $1';
        this.input = req.body;
    }
    handler() {
        let user;
        let cart;
        let session = new resources_1.User(this.req.session.user);
        return this.db.query(this.userSelect, this.input.email)
            .then((result) => {
            user = new resources_1.UserDB(result.rows[0]);
            if (result.rows.length === 0) {
                throw new Error("Email not found");
            }
            else {
                return bcrypt.compare(this.input.password, user.password);
            }
        })
            .then((result) => {
            if (result === false) {
                throw new Error('Password incorrect');
            }
            else {
                return help.regenerateSession(this.req);
            }
        })
            .then(() => {
            return async_database_1.db.query(this.updateSessionID, [this.req.sessionID, user.user_uuid]);
        })
            .then((result) => {
            return async_database_1.db.query(this.selectCartID, [user.user_uuid]);
        })
            .then((result) => {
            cart = new resources_1.CartDB(result.rows[0]);
            req.session.user = {
                email: input.email,
                uuid: input.user_uuid,
                cart_uuid: cart_uuid,
                permission: input.permission
            };
            return req.db.query('select NOW()');
        })
            .then((result) => {
            console.log(result);
            if (req.session.user.permission === 'admin') {
                res.render('admin/home');
            }
            else if (req.session.user.permission === 'user') {
                res.render('home', {
                    title: "yo",
                    email: req.session.user.email
                });
            }
        });
    }
}
router.post('/authorized', (req, res) => {
    let user = new resources_1.User(req.session.user);
});
router.route('/authorized')
    .post((req, res) => {
    let input = {};
    let cart_uuid;
    async_database_1.db.query("SELECT * FROM users WHERE email = $1", [req.body.email])
        .then((result) => {
        if (result.rows.length === 0) {
            throw new Error("Email not found");
        }
        else {
            input = result.rows[0];
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
        return async_database_1.db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [req.sessionID, input.user_uuid]);
    })
        .then((result) => {
        return async_database_1.db.query('SELECT cart_uuid FROM cart WHERE user_uuid = $1', [input.user_uuid]);
    })
        .then((result) => {
        cart_uuid = result.rows[0].cart_uuid;
        req.session.user = {
            email: input.email,
            uuid: input.user_uuid,
            cart_uuid: cart_uuid,
            permission: input.permission
        };
        return req.db.query('select NOW()');
    })
        .then((result) => {
        console.log(result);
        if (req.session.user.permission === 'admin') {
            res.render('admin/home');
        }
        else if (req.session.user.permission === 'user') {
            res.render('home', {
                title: "yo",
                email: req.session.user.email
            });
        }
    })
        .catch((error) => {
        console.log(error);
        res.render('login', { dbError: error });
    });
});
router.post('/log-out', function (req, res, next) {
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