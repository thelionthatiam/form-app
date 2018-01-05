"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper = require("../functions/helpers");
const express = require("express");
const router = express.Router();
function check(req, res, next) {
    if (req.session && req.session.user && req.session.cookie) {
        console.log(req.session.cookie);
        next();
    }
    else {
        req.session = null;
        helper.genError(res, 'login', "you were no longer logged in, try to log in again");
    }
}
exports.check = check;
//# sourceMappingURL=session-check.js.map