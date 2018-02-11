"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// DATA ACCESS TIER
class Query {
    constructor(conn) {
        this.conn = conn;
    }
    // select
    selectUser(values) {
        const query = "SELECT * FROM users WHERE email = $1";
        return this.conn.query(query, values);
    }
    selectUserOrgs(values) {
        const query = "SELECT * FROM user_orgs WHERE user_uuid = $1";
        return this.conn.query(query, values);
    }
    selectOrder(values) {
        const query = "SELECT * FROM orders WHERE user_uuid = $1";
        return this.conn.query(query, values);
    }
    selectCart(values) {
        const query = 'SELECT * FROM cart WHERE user_uuid = $1';
        return this.conn.query(query, values);
    }
    selectOrgs(values) {
        const query = 'SELECT * FROM orgs';
        return this.conn.query(query, values);
    }
    selectAlarms(values) {
        const query = 'SELECT * FROM alarms WHERE user_uuid = $1';
        return this.conn.query(query, values);
    }
    // insert
    insertSnooze(values) {
        const query = 'INSERT snooze(user_uuid, alarm_uuid) VALUES ($1, $2)';
        return this.conn.query(query, values);
    }
    // update
    updateSessionID(values) {
        const query = 'UPDATE session SET sessionid = $1 WHERE user_uuid = $2';
        return this.conn.query(query, values);
    }
}
exports.Query = Query;
;
//# sourceMappingURL=queries.js.map