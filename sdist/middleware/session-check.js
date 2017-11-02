// import * as helper from '../functions/helpers';
var query = require('../functions/queries');
var helper = require('../functions/helpers');
// session check: query for table row, check session information against table, craete object to store user information
function sessionCheck(req, res, next) {
    var thisPage = 'login';
    if (req.session && req.session.user) {
        var inputs = req.session.user;
        req.querySvc.selectSessionUser(inputs, function (err, result) {
            if (err) {
                helper.dbError(res, thisPage, err); // u
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
module.exports = {
    check: sessionCheck
};
//# sourceMappingURL=session-check.js.map