"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper = require("../functions/helpers");
function check(req, res, next) {
    var thisPage = 'login';
    if (req.session && req.session.user) {
        // var sessionInputs = req.session.user
        var inputs = {
            email: req.session.user[0],
            password: req.session.user[1],
            phone: req.session.user[2]
        };
        req.querySvc.selectSessionUser(inputs, (err, result) => {
            if (err) {
                helper.dbError(res, thisPage, JSON.stringify(err)); // u90
            }
            else if (result.rowCount === 0) {
                helper.genError(res, thisPage, "something went wrong with the session, try to log in again"); // u
            }
            else {
                req.user = {
                    email: result.rows[0].email,
                    phone: result.rows[0].phone,
                    userID: result.rows[0].user_uuid
                };
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