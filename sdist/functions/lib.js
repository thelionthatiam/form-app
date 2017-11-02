// import * as nodeMailer from 'nodemailer';
// import * as helper from './helpers';
var nodeMailer = require('nodemailer');
var helper = require('./helpers');
var mailConfig = require('../config/mail-config');
function logout(req, res, thisPage, param) {
    if (param === void 0) { param = "Welcome back!"; }
    req.session.destroy(function (err) {
        if (err) {
            helper.genError(res, thisPage, "Could not log out normally.");
        }
        else {
            res.render('index', {
                title: "A pleasent form app",
                subtitle: param,
            });
        }
    });
}
function sendMail(mailOptions, transporter, cb) {
    // console.log('start', mailOptions, transporter);
    mailConfig.transporter.sendMail(mailConfig.mailOptions, function (error, info) {
        if (error) {
            cb(error);
        }
        else {
            console.log('Email sent: ' + info.response);
            cb(null, info);
        }
    });
}
function sessionValid(token, outputs, cb) {
    console.log('sessionValid');
    var nonce = outputs.nonce;
    var oldDate = new Date(outputs.thetime);
    var oldTime = oldDate.getTime();
    var currentDate = new Date();
    var currentTime = currentDate.getTime();
    // console.log(token, nonce, oldTime, currentTime);
    if (token === nonce && currentTime < oldTime + 120000) {
        cb(true);
    }
    else {
        cb(false);
    }
}
//
// export {
//   logout,
//   sendMail,
//   sessionValid
// };
module.exports = {
    logout: logout,
    sendMail: sendMail,
    sessionValid: sessionValid
};
//# sourceMappingURL=lib.js.map