"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper = require("../functions/helpers");
const async_database_1 = require("../middleware/async-database");
const express = require("express");
const router = express.Router();
function check(req, res, next) {
    console.log('sessionCheck');
    if (req.session.user && req.sessionID) {
        async_database_1.db.query('SELECT sessionID FROM session WHERE user_uuid = $1', [req.session.user.uuid])
            .then((result) => {
            if (result.rows[0].sessionid === req.sessionID) {
                return async_database_1.db.query('SELECT permission FROM users WHERE user_uuid = $1', [req.session.user.uuid]);
            }
            else {
                helper.genError(res, 'login', "you were no longer logged in, try to log in again");
            }
        })
            .then((result) => {
            if (result.rows[0].permission === 'admin') {
                console.log('admin approved');
                next();
            }
            else if (result.rows[0].permission === 'user') {
                next();
            }
            else if (result.rows[0].permission === 'guest') {
            }
        })
            .catch((error) => {
            console.log(error.stack);
            helper.genError(res, 'login', "you were no longer logged in, try to log in again");
        });
    }
    else {
        req.session = null;
        helper.genError(res, 'login', "you were no longer logged in, try to log in again");
    }
}
exports.check = check;
function adminCheck(req, res, next) {
    console.log('ADMIN sessionCheck');
    if (req.session.user && req.sessionID && req.session.user.permission === 'admin') {
        async_database_1.db.query('SELECT sessionID FROM session WHERE user_uuid = $1', [req.session.user.uuid])
            .then((result) => {
            if (result.rows[0].sessionid === req.sessionID) {
                return async_database_1.db.query('SELECT permission FROM users WHERE user_uuid = $1', [req.session.user.uuid]);
            }
            else {
                helper.genError(res, 'login', "you were no longer logged in, try to log in again");
            }
        })
            .then((result) => {
            if (result.rows[0].permission === 'admin') {
                console.log('admin approved');
                next();
            }
            else if (result.rows[0].permission === 'user') {
                console.log('not admin');
                helper.genError(res, 'login', "you were no longer logged in, try to log in again");
            }
            else if (result.rows[0].permission === 'guest') {
            }
        })
            .catch((error) => {
            console.log(error.stack);
            helper.genError(res, 'login', "you were no longer logged in, try to log in again");
        });
    }
    else {
        req.session = null;
        helper.genError(res, 'login', "you were no longer logged in or you do not have permission to access this page");
    }
}
exports.adminCheck = adminCheck;
//# sourceMappingURL=session-check.js.map