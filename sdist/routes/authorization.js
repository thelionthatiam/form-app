"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const help = require("../functions/promise-helpers");
const bcrypt = require("bcrypt");
const uuidv4 = require("uuid/v4");
const test_1 = require("./test");
const r = require("../config/resources");
const router = express.Router();
class AuthHandler extends test_1.BaseRequestHandler {
    constructor(req, res, nextPage, errPage) {
        super(req, res, nextPage, errPage);
        this.inputs = req.body;
    }
    handler() {
        let renderObj;
        let user;
        let cart;
        let userSession;
        this.aQuery.selectUser([this.inputs.email])
            .then((result) => {
            if (result.rows.length === 0) {
                throw new Error("Email not found");
            }
            else {
                user = new r.UserDB(result.rows[0]);
                return bcrypt.compare(this.inputs.password, user.password);
            }
        })
            .then((result) => {
            if (result === false) {
                throw new Error('Password incorrect');
            }
            else {
                return help.regenerateSession(this.req);
            }
        })
            .then(() => {
            return this.aQuery.updateSessionID([this.req.sessionID, user.user_uuid]);
        })
            .then((result) => {
            return this.aQuery.selectCart([user.user_uuid]);
        })
            .then((result) => {
            cart = new r.CartDB(result.rows[0]);
            userSession = {
                email: user.email,
                uuid: user.user_uuid,
                permission: user.permission,
                cart_uuid: cart.cart_uuid
            };
            this.req.session.user = userSession;
            renderObj = { email: user.email };
            if (user.permission === 'admin') {
                this.res.render('admin/home');
            }
            else if (user.permission === 'user') {
                this.onSuccess(result);
            }
        })
            .catch((error) => {
            this.onFailure(error);
        });
    }
}
router.post('/authorized', (req, res) => {
    let auth = new AuthHandler(req, res, 'home', 'login');
    auth.handler();
});
// router.route('/authorized')
//   .post((req, res) => {
//     let input:Inputs = {};
//     let cart_uuid;
//
//     db.query("SELECT * FROM users WHERE email = $1", [req.body.email])
//       .then((result) => {
//         if (result.rows.length === 0) {
//           throw new Error("Email not found")
//         } else {
//           input = result.rows[0];
//           return bcrypt.compare(req.body.password, result.rows[0].password)
//         }
//       })
//       .then((result) => {
//         if (result === false) {
//           throw new Error('Password incorrect');
//         } else {
//           return help.regenerateSession(req);
//         }
//       })
//       .then(() => {
//         return db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [req.sessionID, input.user_uuid]);
//       })
//       .then((result) => {
//         return db.query('SELECT cart_uuid FROM cart WHERE user_uuid = $1', [input.user_uuid])
//       })
//       .then((result) => {
//         cart_uuid = result.rows[0].cart_uuid;
//         req.session.user = {
//           email:input.email,
//           uuid:input.user_uuid,
//           cart_uuid:cart_uuid,
//           permission:input.permission
//         }
//
//         return req.db.query('select NOW()')
//       })
//       .then((result) => {
//         console.log(result)
//         if (req.session.user.permission === 'admin') {
//           res.render('admin/home')
//         } else if (req.session.user.permission === 'user') {
//           res.render('home', {
//             email:req.session.user.email
//           })
//         }
//       })
//       .catch((error) => {
//         console.log(error)
//         res.render('login', { dbError:error })
//       })
//   })
router.post('/log-out', function (req, res, next) {
    let inactive = uuidv4(); //if its uuidv4 its inactive
    db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [inactive, req.session.user.uuid])
        .then((result) => {
        req.session.destroy(function (err) {
            if (err) {
                res.render('error', { errName: err.message, errMessage: null });
            }
            else {
                console.log("after destory", req.session);
                res.render('login');
            }
        });
    });
});
module.exports = router;
//# sourceMappingURL=authorization.js.map