"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isUUID = require("is-uuid");
class Email {
    constructor(value) {
        this._value = Email.validate(value);
    }
    static validate(value) {
        let re = /^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$/;
        if (re.test(value)) {
            return value;
        }
        else {
            throw new Error('Not a real email.');
        }
    }
}
class UUID {
    constructor(value) {
        this._value = UUID.validate(value);
    }
    static validate(UUID) {
        if (isUUID.v4(UUID)) {
            return (UUID);
        }
        else {
            throw new Error('Not a real uuid.');
        }
    }
}
class Permission {
    constructor(value) {
        this._value = Permission.validate(value);
    }
    static validate(permission) {
        let re = /(guest)|(user)|(admin)/;
        if (re.test(permission)) {
            return permission;
        }
        else {
            throw new Error('Not a real permission');
        }
    }
}
class UserSession {
    constructor(userSession = {}) {
        this.email = Email.validate(userSession.email);
        this.uuid = UUID.validate(userSession.uuid);
        this.cart_uuid = UUID.validate(userSession.cart_uuid);
        this.permission = Permission.validate(userSession.permission);
    }
    static validate(userSession) {
        if (userSession.email && userSession.uuid && userSession.cart_uuid && userSession.permission) {
            return userSession;
        }
        else {
            throw new Error('User session does not have the right properties');
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
exports.CartDB = CartDB;
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