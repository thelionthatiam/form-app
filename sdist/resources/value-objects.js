"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./validation");
// THIS COULD LIVE SOMEWHERE ELSE
class ValidationResult {
    static isValid(args, obj) {
        for (let k in obj) {
            if (args.hasOwnProperty(k)) {
                let res = obj[k];
                if (!res.isOkay)
                    return res;
            }
            else {
                let message = 'MISSING PROPERTY: ' + k;
                throw new validation_1.ValidationError(null, message);
            }
        }
    }
    get isOkay() { return false; }
}
class UserSession {
    constructor(args = {}) {
        this.email = args.email;
        this.uuid = args.uuid;
        this.cart_uuid = args.cart_uuid;
        this.permission = args.permission;
        this.name = args.name;
    }
    static fromJSON(args) {
        let res = UserSession.validate(args);
        if (res.isOkay) {
            let res = new UserSession({
                email: validation_1.Email.create(args.email),
                uuid: validation_1.UUID.create(args.uuid),
                permission: validation_1.Permission.create(args.permission),
                cart_uuid: validation_1.UUID.create(args.cart_uuid),
                name: validation_1.CharOnly.create(args.name),
            });
            return res.toJSON();
        }
        else {
            throw new Error('error happens at fromJSON');
        }
    }
    static validate(args) {
        let propValidation = {
            email: validation_1.Email.validate(args.email),
            uuid: validation_1.UUID.validate(args.uuid),
            permission: validation_1.Permission.validate(args.permission),
            cart_uuid: validation_1.UUID.validate(args.cart_uuid),
            name: validation_1.CharOnly.validate(args.name),
        };
        ValidationResult.isValid(args, propValidation);
        return { isOkay: true };
    }
    toJSON() {
        return {
            email: this.email.toString(),
            uuid: this.uuid.toString(),
            permission: this.permission.toString(),
            cart_uuid: this.cart_uuid.toString(),
            name: this.name.toString()
        };
    }
}
exports.UserSession = UserSession;
class UserDB {
    constructor(args = {}) {
        this.email = args.email;
        this.user_uuid = args.user_uuid;
        this.permission = args.permission;
        this.phone = args.phone;
        this.name = args.name;
        this.password = args.password;
    }
    static fromJSON(args) {
        let res = UserDB.validate(args);
        if (res.isOkay) {
            let res = new UserDB({
                email: validation_1.Email.create(args.email),
                user_uuid: validation_1.UUID.create(args.user_uuid),
                permission: validation_1.Permission.create(args.permission),
                phone: validation_1.NumOnly.create(args.phone),
                name: validation_1.CharOnly.create(args.name),
                password: validation_1.String.create(args.password)
            });
            return res.toJSON();
        }
        else {
            throw new Error('error happens at fromJSON');
        }
    }
    static validate(args) {
        let propValidation = {
            email: validation_1.Email.validate(args.email),
            user_uuid: validation_1.UUID.validate(args.user_uuid),
            permission: validation_1.Permission.validate(args.permission),
            phone: validation_1.NumOnly.validate(args.phone),
            name: validation_1.CharOnly.validate(args.name),
            password: validation_1.String.validate(args.password)
        };
        ValidationResult.isValid(args, propValidation);
        return { isOkay: true };
    }
    toJSON() {
        return {
            email: this.email.toString(),
            user_uuid: this.user_uuid.toString(),
            permission: this.permission.toString(),
            phone: this.phone.toString(),
            name: this.name.toString(),
            password: this.password.toString()
        };
    }
}
exports.UserDB = UserDB;
// user_uuid
// org_uuid
// active
class UserOrgsDB {
    constructor(args = {}) {
        this.user_uuid = args.user_uuid;
        this.org_uuid = args.org_uuid;
        this.active = args.active;
    }
    static fromJSON(args) {
        let res = UserOrgsDB.validate(args);
        if (res.isOkay) {
            let res = new UserOrgsDB({
                user_uuid: validation_1.UUID.create(args.user_uuid),
                org_uuid: validation_1.UUID.create(args.org_uuid),
                active: validation_1.Bool.create(args.active),
            });
            return res.toJSON();
        }
        else {
            throw new Error('error happens at fromJSON');
        }
    }
    static validate(args) {
        let propValidation = {
            user_uuid: validation_1.UUID.validate(args.user_uuid),
            org_uuid: validation_1.UUID.validate(args.org_uuid),
            active: validation_1.Bool.validate(args.active),
        };
        ValidationResult.isValid(args, propValidation);
        return { isOkay: true };
    }
    toJSON() {
        return {
            user_uuid: this.user_uuid.toString(),
            org_uuid: this.org_uuid.toString(),
            active: this.active.toString(),
        };
    }
}
exports.UserOrgsDB = UserOrgsDB;
class CartDB {
    constructor(args = {}) {
        this.user_uuid = args.user_uuid;
        this.cart_uuid = args.cart_uuid;
        this.card_number = args.card_number;
    }
    static fromJSON(args) {
        let res = CartDB.validate(args);
        if (res.isOkay) {
            let res = new CartDB({
                user_uuid: validation_1.UUID.create(args.user_uuid),
                cart_uuid: validation_1.UUID.create(args.cart_uuid),
                card_number: validation_1.NumOnly.create(args.card_number),
            });
            return res.toJSON();
        }
        else {
            throw new Error('error happens at fromJSON');
        }
    }
    static validate(args) {
        let propValidation = {
            user_uuid: validation_1.UUID.validate(args.user_uuid),
            cart_uuid: validation_1.UUID.validate(args.cart_uuid),
            card_number: validation_1.NumOnly.validate(args.card_number),
        };
        ValidationResult.isValid(args, propValidation);
        return { isOkay: true };
    }
    toJSON() {
        return {
            user_uuid: this.user_uuid.toString(),
            cart_uuid: this.cart_uuid.toString(),
            card_number: this.card_number.toString(),
        };
    }
}
exports.CartDB = CartDB;
class OrgsDB {
    constructor(args = {}) {
        this.org_uuid = args.org_uuid;
        this.org_sku = args.org_sku;
        this.name = args.name;
        this.description = args.description;
        this.cause = args.cause;
        this.link = args.link;
    }
    static fromJSON(args) {
        let res = OrgsDB.validate(args);
        if (res.isOkay) {
            let res = new OrgsDB({
                org_uuid: validation_1.UUID.create(args.org_uuid),
                org_sku: validation_1.String.create(args.org_sku),
                name: validation_1.CharOnly.create(args.name),
                description: validation_1.String.create(args.description),
                cause: validation_1.CharOnly.create(args.cause),
                link: validation_1.String.create(args.link),
            });
            return res.toJSON();
        }
        else {
            throw new Error('error happens at fromJSON');
        }
    }
    static validate(args) {
        let propValidation = {
            org_uuid: validation_1.UUID.validate(args.org_uuid),
            org_sku: validation_1.String.validate(args.org_sku),
            name: validation_1.CharOnly.validate(args.name),
            description: validation_1.String.validate(args.description),
            cause: validation_1.CharOnly.validate(args.cause),
            link: validation_1.String.validate(args.link),
        };
        ValidationResult.isValid(args, propValidation);
        return { isOkay: true };
    }
    toJSON() {
        return {
            org_uuid: this.org_uuid.toString(),
            org_sku: this.org_sku.toString(),
            name: this.name.toString(),
            description: this.description.toString(),
            cause: this.cause.toString(),
            link: this.link.toString(),
        };
    }
}
exports.OrgsDB = OrgsDB;
//# sourceMappingURL=value-objects.js.map