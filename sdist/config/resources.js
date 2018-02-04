"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isUUID = require("is-uuid");
const password_strength_1 = require("../functions/password-strength");
// credit card
// timestamp?
// sessionid
class UserException {
    constructor(name, message) {
        this.message = message;
        this.name = name.toUpperCase();
    }
}
class Email {
    constructor(value) {
        this._value = Email.validate(value);
    }
    static validate(email) {
        let re = /^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$/;
        if (re.test(email)) {
            return email;
        }
        else {
            throw new UserException('invalid type', 'This value -- ' + email + ' -- is not an email.');
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
            throw new UserException('invalid type', 'This value -- ' + UUID + ' -- is not a uuid.');
        }
    }
}
class Permission {
    constructor(value) {
        this._value = Permission.validate(value);
    }
    static validate(permission) {
        let re = /^(guest)$|^(user)$|^(admin)$/;
        if (re.test(permission)) {
            return permission;
        }
        else {
            throw new UserException('invalid type', 'This value -- ' + permission + ' -- is not a permission.');
        }
    }
}
class ID {
    constructor(value) {
        this._value = ID.validate(value);
    }
    static validate(id) {
        if (typeof id === 'number') {
            return id;
        }
        else {
            throw new UserException('invalid type', 'This value -- ' + ID + ' -- is not an ID.');
        }
    }
}
class Number {
    constructor(value) {
        this._value = Number.validate(value);
    }
    static validate(number) {
        if (typeof number === 'number') {
            return number;
        }
        else {
            throw new UserException('invalid type', 'This value -- ' + Number + ' -- is not an Number.');
        }
    }
}
class Password {
    constructor(value) {
        this._value = Password.validate(value);
    }
    static validate(password) {
        if (password_strength_1.simpleScorer(password) > 59) {
            return password;
        }
        else {
            throw new UserException('weak password', 'This value -- ' + Number + ' -- is not a strong enough password.');
        }
    }
}
class Name {
    constructor(value) {
        this._value = Name.validate(value);
    }
    static validate(name) {
        let re = /^([a-zA-Z]{1,15})( [a-zA-Z]{1,15})?([ -]?[a-zA-Z]{1,15})?$/;
        if (re.test(name)) {
            return name;
        }
        else {
            throw new UserException('invalid type', 'This value -- ' + name + ' -- is not a name.');
        }
    }
}
class UserSession {
    static create(userSession = {}) {
        let output = {};
        for (let k in userSession) {
            if (k === 'email' ||
                k === 'permission' ||
                k === 'uuid' ||
                k === 'cart_uuid') {
                output.email = userSession.email._value;
                output.uuid = userSession.uuid._value;
                output.cart_uuid = userSession.cart_uuid._value;
                output.permission = userSession.permission._value;
            }
            else {
                throw new UserException('Unknown property present on object', 'userSession should not contain property ' + k);
            }
        }
        return output;
    }
}
exports.UserSession = UserSession;
class UserDB {
    static create(userDB = {}) {
        let output = {};
        for (let k in userSession) {
            if (k === 'id' ||
                k === 'user_uuid' ||
                k === 'email' ||
                k === 'phone' ||
                k === 'password' ||
                k === 'name' ||
                k === 'permission') {
                output.id = userDB.id._value;
                output.user_uuid = userDB.user_uuid._value;
                output.email = userDB.email._value;
                output.phone = userDB.phone._value;
                output.password = userDB.password._value;
                output.name = userDB.name._value;
                output.permission = userDB.permission._value;
            }
            else {
                throw new UserException('Unknown property present on object', 'userDB should not contain property ' + k);
            }
        }
        return output;
    }
}
exports.UserDB = UserDB;
class CartDB {
    static create(cartDB = {}) {
        let output = {};
        for (let k in cartDB) {
            if (k === 'id' ||
                k === 'user_uuid' ||
                k === 'cart_uuid' ||
                k === 'card_number') {
                output.id = cartDB.id._value;
                output.user_uuid = cartDB.user_uuid._value;
                output.cart_uuid = cartDB.cart_uuid._value;
                output.card_number = cartDB.card_number._value;
            }
            else {
                throw new UserException('Unknown property present on object', 'cartDB should not contain property ' + k);
            }
        }
        return output;
    }
}
exports.CartDB = CartDB;
class OrderDB {
    static create(orderDB = {}) {
        let output = {};
        for (let k in orderDB) {
            if (k === 'id' ||
                k === 'user_uuid' ||
                k === 'order_id' ||
                k === 'order_uuid' ||
                k === 'card_number' ||
                k === 'order_number') {
                output.id = orderDB.id._value;
                output.user_uuid = orderDB.user_uuid._value;
                output.order_id = orderDB.order_id._value;
                output.order_uuid = orderDB.order_uuid._value;
                output.card_number = orderDB.card_number._value;
                output.order_number = orderDB.order_number._value;
            }
            else {
                throw new UserException('Unknown property present on object', 'orderDB should not contain property ' + k);
            }
        }
        return output;
    }
}
exports.OrderDB = OrderDB;
class SessionDB {
    static create(sessionDB = {}) {
        let output = {};
        for (let k in sessionDB) {
            if (k === 'id' ||
                k === 'order_number') {
                output.user_uuid = sessionDB.user_uuid._value;
                output.sessionid = sessionDB.sessionid._value;
            }
            else {
                throw new UserException('Unknown property present on object', 'sessionDB should not contain property ' + k);
            }
        }
        return output;
    }
}
exports.SessionDB = SessionDB;
//# sourceMappingURL=resources.js.map