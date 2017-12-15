"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper = require("../functions/helpers");
function check(req, res, next) {
    var thisPage = 'login';
    if (req.session && req.session.user) {
        var sessionInputs = req.session.user;
        var inputs = {
            email: req.session.user.email,
            password: req.session.user.password,
            phone: req.session.user.phone
        };
        req.querySvc.selectSessionUser(inputs, (err, result) => {
            if (err) {
                helper.dbError(res, thisPage, JSON.stringify(err));
            }
            else if (result.rowCount === 0) {
                helper.genError(res, thisPage, "something went wrong with the session, try to log in again");
            }
            else {
                next();
            }
        });
    }
    else {
        req.session = null;
        helper.genError(res, thisPage, "you were no longer logged in, try to log in again");
    }
}
exports.check = check;
//# sourceMappingURL=session-check.js.map