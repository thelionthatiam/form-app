"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mail_config_1 = require("../config/mail-config");
const lib = require("../functions/lib");
const helper = require("../functions/helpers");
const express = require("express");
const app = express();
app.post('/mailer', function (req, res, next) {
    console.log('/mailer');
    console.log(mail_config_1.mailOptions);
    let inputs;
    // if logged in, email typed in or neither
    if (typeof req.session.user !== 'undefined') {
        mail_config_1.mailOptions.to = req.session.user[0];
        inputs = {
            email: req.session.user[0],
        };
        res.locals.inputs = inputs;
        next();
    }
    else if (typeof req.body.email === 'string') {
        mail_config_1.mailOptions.to = req.body.email;
        inputs = {
            email: req.body.email,
        };
        res.locals.inputs = inputs;
        next();
    }
    else {
        res.render('email-password', { mailNotSent: true });
    }
}, function (req, res, next) {
    let thisPage = 'login';
    let nextPage = 'email-password';
    console.log('inputs', res.locals.inputs);
    let inputs = res.locals.inputs;
    req.querySvc.selectRowViaEmail(inputs, function (err, result) {
        if (err) {
            helper.dbError(res, thisPage, err);
        }
        else {
            if (result.rows.length === 0) {
                helper.genError(res, thisPage, "Email not found");
            }
            else {
                var outputs = result.rows[0];
                helper.makeHashedString(function (err, hash) {
                    if (err) {
                        helper.genError(res, thisPage, "Password encryption error");
                    }
                    else {
                        var outputs = result.rows[0];
                        inputs.user_uuid = outputs.user_uuid;
                        req.session.uuid = outputs.user_uuid;
                        inputs.nonce = hash;
                        req.querySvc.updateNonce(inputs, function (err, result) {
                            var outputs = result.rows[0];
                            req.session.token = inputs.nonce;
                            res.locals = inputs.nonce;
                            if (err) {
                                helper.dbError(res, thisPage, err);
                            }
                            else {
                                console.log('MAIL SESSION', req.session);
                                lib.sendMail(mail_config_1.mailOptions, mail_config_1.transporter, function (error, info) {
                                    res.render(nextPage, {
                                        message: "go check your email and follow the link",
                                    });
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});
app.get('/new-password', function (req, res, next) {
    console.log('/new-password');
    let thisPage = 'login';
    let nextPage = 'new-password';
    let inputs = {
        user_uuid: req.session.uuid
    };
    req.querySvc.selectNonceAndTimeViaUID(inputs, function (err, result) {
        if (err) {
            helper.dbError(res, thisPage, err);
        }
        else {
            console.log('length', result.rows.length);
            if (result.rows.length === 0) {
                helper.genError(res, thisPage, "Account not found.");
            }
            else {
                console.log('req session token', req.session.token);
                var outputs = result.rows[0];
                var token = req.session.token;
                lib.sessionValid(token, outputs, function (bool) {
                    if (bool) {
                        res.render(nextPage, null);
                    }
                    else {
                        res.render(thisPage, { dbError: 'Sorry, your token expired. Login again.' });
                    }
                });
            }
        }
    });
});
// change password: hash new pass, update database, update session, check the session
app.post('/change-password', function (req, res, next) {
    console.log('/change-password');
    let thisPage = 'login';
    let nextPage = 'manage-account';
    let inputs = {
        newPassword: req.body.password,
        user_uuid: req.session.userID,
        hashedPassword: ''
    };
    console.log('password', req.body.password);
    console.log('uuid', req.session.userID);
    helper.hash(inputs.newPassword, function (err, hash) {
        if (err) {
            helper.genError(res, thisPage, err); // u
        }
        else {
            inputs.hashedPassword = hash;
            req.querySvc.updatePassword(inputs, function (err, result) {
                if (err) {
                    helper.dbError(res, thisPage, err); // u
                }
                else {
                    mail_config_1.mailOptions.to = null;
                    // logged in version
                    if (req.session && req.session.user) {
                        req.session.user[1] = hash;
                        console.log(req.session.user);
                        res.render(nextPage, {
                            subtitle: 'password updated',
                            email: req.session.user[0],
                            phone: req.session.user[2],
                            changePassword: false
                        });
                        // forgot password version
                    }
                    else {
                        res.render('login', { subtitle: "try your new password!" }); // u
                    }
                }
            });
        }
    });
});
module.exports = app;
//# sourceMappingURL=mailer.js.map