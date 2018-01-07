"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper = require("../functions/helpers");
const async_database_1 = require("../middleware/async-database");
const express = require("express");
const router = express.Router();
function check(req, res, next) {
    if (req.session.user && req.sessionID) {
        async_database_1.db.query('SELECT sessionID FROM session WHERE user_uuid = $1', [req.session.user.uuid])
            .then((result) => {
            if (result.rows[0].sessionid === req.sessionID) {
                next();
            }
            else {
                throw new Error('incorrect session id');
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
//# sourceMappingURL=session-check.js.map