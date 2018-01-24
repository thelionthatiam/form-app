"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const help = require("../functions/promise-helpers");
const router = express.Router();
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
class BaseReqestHandler {
    constructor(req, res, query, input) {
        this.req = req;
        this.res = res;
        this.query = query;
        this.input = input;
        this.db = req.db;
    }
    handler(promises) {
        return promises
            .then((ObjDB) => {
            this.db.release();
            console.log('after release', this.db.processID, this.db.readyForQuery);
            this.onSuccess(ObjDB);
        })
            .catch((error) => {
            this.db.release();
            console.log('after release', this.db.processID, this.db.readyForQuery);
            this.onFailure(error);
        });
    }
    onSuccess(ObjDB) {
        return this.res.render('test', ObjDB);
    }
    onFailure(error) {
        return this.res.render('login', { dbError: error });
    }
}
router.get('/test-route', (req, res, next) => {
    let u, o;
    let query = [
        'SELECT * FROM users WHERE email = $1',
        'SELECT * FROM orders WHERE user_uuid = $1'
    ];
    let input = [
        [req.query.email]
    ];
    console.log('before request handler', req.db.processID, req.db.readyForQuery);
    let run = new BaseReqestHandler(req, res, query, input);
    run.handler(run.db.query(query[0], input[0])
        .then((result) => {
        u = new UserDB(result.rows[0]);
        input[1] = [u.user_uuid];
        return run.db.query(query[1], input[1]);
    })
        .then((result) => {
        o = new OrderDB(result.rows[0]); // limited this could have multipart result
        console.log('during request handler', req.db.processID, req.db.readyForQuery);
        return help.merger(u, o);
    }));
});
module.exports = router;
//# sourceMappingURL=test.js.map