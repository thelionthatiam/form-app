"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isUUID = require("is-uuid");
class Validation {
    emailValid(email) {
        let re = /^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$/;
        try {
            if (re.test(email)) {
                return email;
            }
            else {
                throw new Error('Not a real email.');
            }
        }
        catch (e) {
            console.log(e);
            // pass failure contition up stream to route and view
            return 'fail';
        }
    }
    uuidValid(uuid) {
        try {
            if (isUUID.v4(uuid)) {
                return (uuid);
            }
            else {
                throw new Error('Not a real uuid.');
            }
        }
        catch (e) {
            console.log(e);
            // pass failure contition up stream to route and view
            return 'fail';
        }
    }
    permissionValid(permission) {
        let re = /(guest)|(user)|(admin)/;
        try {
            if (re.test(permission)) {
                return permission;
            }
            else {
                throw new Error('Not a real permission');
            }
        }
        catch (e) {
            console.log(e);
            // pass failure contition up stream to route and view
            return 'fail';
        }
    }
}
class UserSession extends Validation {
    constructor(userSession) {
        super();
        try {
            this.email = this.emailValid(userSession.email);
            this.uuid = this.uuidValid(userSession.uuid);
            this.cart_uuid = this.uuidValid(userSession.cart_uuid);
            this.permission = this.permissionValid(userSession.permission);
        }
        catch (e) {
            // report error upstream
        }
    }
}
exports.UserSession = UserSession;
class UserDB {
    constructor(userQueryResult) {
        this.user_id = userQueryResult.id;
        this.user_uuid = userQueryResult.user_uuid;
        this.phone = userQueryResult.phone;
        this.password = userQueryResult.password;
        this.name = userQueryResult.name;
        this.permission = userQueryResult.permission;
        this.email = userQueryResult.email;
    }
}
exports.UserDB = UserDB;
class CartDB {
    constructor(cartQueryResult) {
        this.id = cartQueryResult.id;
        this.user_uuid = cartQueryResult.user_uuid;
        this.cart_uuid = cartQueryResult.cart_uuid;
        this.card_number = cartQueryResult.card_number;
    }
}
class OrderDB {
    constructor(orderQueryResult) {
        this.order_id = orderQueryResult.id;
        this.order_uuid = orderQueryResult.order_uuid;
        this.card_number = orderQueryResult.card_number;
        this.order_number = orderQueryResult.order_number;
        this.user_uuid = orderQueryResult.user_uuid;
        this.create_timestamp = orderQueryResult.create_timestamp;
        this.udated_timestamp = orderQueryResult.udated_timestamp;
    }
}
exports.OrderDB = OrderDB;
class SessionDB {
    constructor(sessionQueryResult) {
        this.user_uuid = sessionQueryResult.user_uuid;
        this.sessionid = sessionQueryResult.sessionid;
    }
}
exports.SessionDB = SessionDB;
//# sourceMappingURL=resources.js.map