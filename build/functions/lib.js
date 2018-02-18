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