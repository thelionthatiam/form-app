"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper = require("./helpers");
function logout(req, res, thisPage, param = "Welcome back!") {
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
exports.logout = logout;
function sendMail(mailOptions, transporter, cb) {
    // console.log('start', mailOptions, transporter);
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            cb(error);
        }
        else {
            console.log('Email sent: ' + info.response);
            cb(null, info);
        }
    });
}
exports.sendMail = sendMail;
function sessionValid(token, outputs, cb) {
    console.log('sessionValid');
    var nonce = outputs.nonce;
    var oldDate = new Date(outputs.thetime);
    var oldTime = oldDate.getTime();
    var currentDate = new Date();
    var currentTime = currentDate.getTime();
    if (token === nonce && currentTime < oldTime + 120000) {
        cb(true);
    }
    else {
        cb(false);
    }
}
exports.sessionValid = sessionValid;
//# sourceMappingURL=lib.js.map