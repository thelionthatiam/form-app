import * as express from 'express';
import * as help from '../functions/promise-helpers';
import * as r from '../config/resources';
import { ConnectionConfig, Client } from '../../node_modules/@types/pg/index'; // pg types
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
  let u:r.UserDB,
      o:r.OrderDB;

  let query = [
    'SELECT * FROM users WHERE email = $1',
    'SELECT * FROM orders WHERE user_uuid = $1'
  ];

  let input = [
    [req.query.email]
  ]
  let run = new BaseReqestHandler(req, res, query, input, 'test', 'login')

  run.handler(
    run.db.query(query[0], input[0])
      .then((result) => {
        u = new r.UserDB(result.rows[0])
        input[1] = [u.user_uuid]
        return run.db.query(query[1], input[1])
      })
      .then((result) => {
        o = new r.OrderDB(result.rows[0]) // limited this could have multipart result
        return help.merger(u, o);
      })
    );

})


export { BaseReqestHandler };

module.exports = router;
