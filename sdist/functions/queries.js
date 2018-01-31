"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// DATA ACCESS TIER
class Query {
    constructor(conn) {
        this.conn = conn;
    }
    selectUser(values) {
        const query = "SELECT * FROM users WHERE email = $1";
        return this.conn.query(query, values);
    }
    selectOrder(values) {
        const query = "SELECT * FROM orders WHERE user_uuid = $1";
        return this.conn.query(query, values);
    }
    selectCart(values) {
        const query = 'SELECT cart_uuid FROM cart WHERE user_uuid = $1';
        return this.conn.query(query, values);
    }
    updateSessionID(values) {
        const query = 'UPDATE session SET sessionid = $1 WHERE user_uuid = $2';
        return this.conn.query(query, values);
    }
}
exports.Query = Query;
;
//# sourceMappingURL=queries.js.map