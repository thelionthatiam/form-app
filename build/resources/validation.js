"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isUUID = require("is-uuid");
class UserException {
    constructor(name, message) {
        this.message = message;
        this.name = name.toUpperCase();
    }
}
exports.UserException = UserException;
class ValidationError extends Error {
    constructor(name, message) {
        super(message);
        Error.captureStackTrace(this); // will creae a stack trace.
        this.message = message;
        this.name = name;
    }
    static isOkay() {
        return false;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message
        };
    }
}
exports.ValidationError = ValidationError;
class ValueScalar {
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
}
exports.ValueScalar = ValueScalar;
class Email extends ValueScalar {
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
        if (re.test(email)) {
            return { isOkay: true };
        }
        else {
            return new ValidationError('invalid type', 'This value -- ' + email + ' -- is not an email.');
        }
    }
}
exports.Email = Email;
class Permission extends ValueScalar {
    static fromJSON(value) {
        return Permission.create(value);
    }
    static create(value) {
        let res = Permission.validate(value);
        if (!res.isOkay)
            throw res;
        return new Permission(value);
    }
    static validate(permission) {
        let re = /^(guest)$|^(user)$|^(admin)$/;
        if (re.test(permission)) {
            return { isOkay: true };
        }
        else {
            throw new ValidationError('invalid type', 'This value -- ' + permission + ' -- is not a permission.');
        }
    }
}
exports.Permission = Permission;
class CharOnly extends ValueScalar {
    static fromJSON(value) {
        return CharOnly.create(value);
    }
    static create(value) {
        let res = CharOnly.validate(value);
        if (!res.isOkay)
            throw res;
        return new CharOnly(value);
    }
    static validate(charOnly) {
        let re = /^[a-zA-Z ]+$/;
        if (re.test(charOnly)) {
            return { isOkay: true };
        }
        else {
            throw new ValidationError('invalid type', 'This value -- ' + charOnly + ' -- is not only chars.');
        }
    }
}
exports.CharOnly = CharOnly;
class NumOnly extends ValueScalar {
    static fromJSON(value) {
        return NumOnly.create(value);
    }
    static create(value) {
        let res = NumOnly.validate(value);
        if (!res.isOkay)
            throw res;
        return new NumOnly(value);
    }
    static validate(numOnly) {
        let re = /^[0-9.]+$/;
        if (re.test(numOnly)) {
            return { isOkay: true };
        }
        else {
            throw new ValidationError('invalid type', 'This value -- ' + numOnly + ' -- is not only numbers.');
        }
    }
}
exports.NumOnly = NumOnly;
class UUID extends ValueScalar {
    static fromJSON(value) {
        return UUID.create(value);
    }
    static create(value) {
        let res = UUID.validate(value);
        if (!res.isOkay)
            throw res;
        return new UUID(value);
    }
    static validate(uuid) {
        if (isUUID.v4(uuid)) {
            return { isOkay: true };
        }
        else {
            return new ValidationError('invalid type', 'This value -- ' + uuid + ' -- is not a uuid.');
        }
    }
}
exports.UUID = UUID;
class Bool extends ValueScalar {
    static fromJSON(value) {
        return Bool.create(value);
    }
    static create(value) {
        let res = Bool.validate(value);
        if (!res.isOkay)
            throw res;
        return new Bool(value);
    }
    static validate(boolean) {
        if (typeof boolean === 'boolean') {
            return { isOkay: true };
        }
        else {
            return new ValidationError('invalid type', 'This value -- ' + boolean + ' -- is not a boolean.');
        }
    }
}
exports.Bool = Bool;
class String extends ValueScalar {
    static fromJSON(value) {
        return String.create(value);
    }
    static create(value) {
        let res = String.validate(value);
        if (!res.isOkay)
            throw res;
        return new String(value);
    }
    static validate(string) {
        let re = /.+/;
        if (re.test(string)) {
            return { isOkay: true };
        }
        else {
            return new ValidationError('invalid type', 'This value -- ' + string + ' -- is not a string.');
        }
    }
}
exports.String = String;
//# sourceMappingURL=validation.js.map