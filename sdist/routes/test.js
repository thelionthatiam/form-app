"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const r = require("../config/resources");
const router = express.Router();
class BaseReqestHandler {
    constructor(req, res, query, input, nextPage, errPage) {
        this.req = req;
        this.res = res;
        this.query = query;
        this.input = input;
        this.db = req.db;
        this.nextPage = nextPage;
        this.errPage = errPage;
    }
    handler(promises) {
        return promises
            .then((ObjDB) => {
            this.onSuccess(ObjDB);
        })
            .catch((error) => {
            this.onFailure(error);
        });
    }
    onSuccess(ObjDB) {
        console.log('right before release');
        return this.res.render(this.nextPage, ObjDB);
    }
    onFailure(error) {
        console.log('right before release');
        return this.res.render(this.errPage, { dbError: error });
    }
}
exports.BaseReqestHandler = BaseReqestHandler;
/////////////////////////
// router.get('/test-route', (req, res, next) => {
//   let u:r.UserDB,
//       o:r.OrderDB;
//
//   let query = [
//     'SELECT * FROM users WHERE email = $1',
//     'SELECT * FROM orders WHERE user_uuid = $1'
//   ];
//
//   let input = [
//     [req.query.email]
//   ]
//   let run = new BaseReqestHandler(req, res, query, input, 'test', 'login')
//
//   run.handler(
//     run.db.query(query[0], input[0])
//       .then((result) => {
//         u = new r.UserDB(result.rows[0])
//         console.log(u)
//         input[1] = [u.user_uuid]
//         return run.db.query(query[1], input[1])
//       })
//       .then((result) => {
//         o = new r.OrderDB(result.rows[0]) // limited this could have multipart result
//         console.log(o)
//         return help.merger(u, o);
//       })
//     );
//
// })
let obj = {
    email: 'a@a.aa',
    uuid: 'b1250b28-a43e-4263-9695-1b9618d65f3d',
    cart_uuid: 'a@a.aa',
    permission: 'dffn'
};
let u = new r.User(obj);
console.log(u);
module.exports = router;
//# sourceMappingURL=test.js.map