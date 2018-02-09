"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const help = require("../functions/helpers");
const bcrypt = require("bcrypt");
const uuidv4 = require("uuid/v4");
const r = require("../resources/value-objects");
const handlers_1 = require("../resources/handlers");
const database_1 = require("../middleware/database");
const router = express.Router();
class AuthHandler extends handlers_1.BaseRequestHandler {
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
                user = r.UserDB.fromJSON(result.rows[0]);
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
            .then(() => {
            return this.aQuery.selectCart([user.user_uuid]);
        })
            .then((result) => {
            cart = r.CartDB.fromJSON(result.rows[0]);
            userSession = r.UserSession.fromJSON({
                email: user.email,
                uuid: user.user_uuid,
                permission: user.permission,
                cart_uuid: cart.cart_uuid,
                name: user.name
            });
            this.req.session.user = userSession;
            renderObj = {
                email: user.email,
                name: user.name
            };
            if (user.permission === 'admin') {
                this.res.render('admin/home');
            }
            else if (user.permission === 'user') {
                this.onSuccess(renderObj);
            }
        })
            .catch((error) => {
            console.log(error);
            this.onFailure(error);
        });
    }
}
router.post('/authorized', (req, res) => {
    let auth = new AuthHandler(req, res, 'home', 'login');
    auth.handler();
});
router.post('/log-out', function (req, res, next) {
    let inactive = uuidv4(); //if its uuidv4 its inactive
    database_1.db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [inactive, req.session.user.uuid])
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