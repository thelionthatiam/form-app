"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isUUID = require("is-uuid");
const password_strength_1 = require("../functions/password-strength");
// ADDITIONAL VALIDATION
// credit card
// timestamp?
// sessionid
class UserException {
    constructor(name, message) {
        this.message = message;
        this.name = name.toUpperCase();
    }
}
class ValidationError extends Error {
    constructor(name, message) {
        super(message);
        Error.captureStackTrace(this); // will creae a stack trace.
        this.name = name;
    }
    get isOkay() { return false; }
    toJSON() {
        return Object.assign({ error: this.name }, );
    }
}
class Email {
    constructor(value) {
        this._value = value;
    }
    valueOf() {
        return this._value;
    }
    toString() {
        return this._value;
    }
    toJSON() {
        return this._value;
    }
    static fromJSON(value) {
        return Email.create(value);
    }
    static create(value) {
        let res = Email.validate(value);
        if (!res.isOkay)
            throw res;
        return new Email(value);
    }
    static validate(email) {
        let re = /^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$/;
        // if we are not returning the string value, we just need to return the validation result. which either is an error result or okay result.
        if (re.test(email)) {
            return { isOkay: true };
        }
        else {
            return new ValidationError('invalid type', 'This value -- ' + email + ' -- is not an email.');
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
    constructor() {
    }
    static create(args = {}) {
        // all hese objects already validatted
        if (!args.email)
            throw new Error(); // whatever error you want to throw.
        if (!args.uuid)
            // ...
            return new UserSession(...);
    }
    static fromJSON(args) {
        let res = UserSession.validate(args);
        if (res.isOkay) {
            return create(Object.assign({ email: Email.create(args.email), uuid: UUID.create(args.uuid) }, ));
        }
        else {
            throw res;
        }
    }
    static validate(args) {
        if (args.hasOwnProperty('email')) {
            let res = Email.validate(args.email);
            if (!res.isOkay)
                return res;
        }
        // ...
        return { isOkay: true };
    }
    static toJSON() {
        return Object.assign({ email: this.email.toJSON(), uuid: this.uuid.toJSON() }, );
    }
}
exports.UserSession = UserSession;
db.query('select * from some table')
    .then((records) => {
    //return records.map((rec) => UserSession.fromJSON(rec));
    return UserSession.fromJSON(records[0]); // need to ensure there is only 1 rec.
})
    .then((userSession) => {
    return res.json(userSession);
})
    .catch((e) => {
    return res.json(e);
});
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