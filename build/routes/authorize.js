"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib = require("../functions/lib");
const helper = require("../functions/helpers");
const express = require("express");
const router = express.Router();
router.post('/log-out', function (req, res, next) {
    console.log('/log-out');
    var thisPage = 'login';
    var nextPage = 'index';
    lib.logout(req, res, thisPage);
});
router.post('/delete', function (req, res, next) {
    console.log('/delete');
    var thisPage = 'login';
    var nextPage = 'index';
    var inputs = {
        email: req.body.email,
        password: req.body.password,
    };
    req.querySvc.selectRowViaEmail(inputs, function (err, result) {
        if (err) {
            res.render(thisPage, { dbError: err, accountDelete: true });
        }
        else {
            if (result.rows.length === 0) {
                res.render(thisPage, { dbError: 'Email not found.', accountDelete: true });
            }
            else {
                var output = result.rows[0];
                var realPass = output.password;
                helper.hashCheck(req.body.password, realPass, function (err, result) {
                    if (err) {
                        res.render('error', { errName: err, errMessage: "Password encryption error" });
                    }
                    else if (result === false) {
                        res.render(thisPage, { dbError: err, accountDelete: true });
                    }
                    else {
                        req.querySvc.removeUserViaEmail(inputs, function (err, result) {
                            if (err) {
                                helper.dbError(res, thisPage, JSON.stringify(err));
                            }
                            else {
                                res.render(nextPage, { title: "Welcome back!", subtitle: "Your account was deleted, make a new one if you want to come back in" });
                            }
                        });
                    }
                });
            }
        }
    });
});
module.exports = router;
//# sourceMappingURL=authorize.js.map