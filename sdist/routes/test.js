"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const help = require("../functions/promise-helpers");
const r = require("../config/resources");
const router = express.Router();
//
// class BaseReqestHandler {
//   req:Express.Request;
//   res:Response;
//   query:string[];
//   input:Inputs;
//   db:Client;
//   nextPage:string;
//   errPage:string;
//
//
//   constructor(req:Express.Request, res:Response, query:string[], input:Inputs, nextPage:string, errPage:string)  {
//     this.req = req;
//     this.res = res;
//     this.query = query;
//     this.input = input;
//     this.db = req.db;
//     this.nextPage = nextPage;
//     this.errPage = errPage;
//   }
//
//
//   handler(promises:any, RenderObj:any) {
//     return promises
//       .then((renderObj) => {
//         this.onSuccess(ObjDB);
//       })
//       .catch((error:Error) => {
//         this.onFailure(error)
//       })
//   }
//
//   onSuccess(renderObj:any, ) {
//     this.db.release();
//     return this.res.render(this.nextPage, ObjDB)
//   }
//
//   onFailure(error:Error, ) {
//     this.db.release();
//     return this.res.render(this.errPage, { dbError: error })
//   }
// }
/////////////////////////
router.get('/test-route', (req, res, next) => {
    let u, o;
    let query = [
        'SELECT * FROM users WHERE email = $1',
        'SELECT * FROM orders WHERE user_uuid = $1'
    ];
    let input = [
        [req.query.email]
    ];
    let run = new BaseReqestHandler(req, res, query, input, 'test', 'login');
    run.handler(run.db.query(query[0], input[0])
        .then((result) => {
        u = new r.UserDB(result.rows[0]);
        input[1] = [u.user_uuid];
        return run.db.query(query[1], input[1]);
    })
        .then((result) => {
        o = new r.OrderDB(result.rows[0]); // limited this could have multipart result
        return help.merger(u, o);
    }));
});
module.exports = router;
//# sourceMappingURL=test.js.map