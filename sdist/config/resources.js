"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(userSession) {
        this.email = userSession.email;
        this.uuid = userSession.uuid;
        this.cart_uuid = userSession.cart_uuid;
        this.permission = userSession.permission;
    }
}
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