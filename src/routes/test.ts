import * as express from 'express';
import * as help from '../functions/promise-helpers';
import * as r from '../config/resources';
import { ConnectionConfig, Client } from '../../node_modules/@types/pg/index'; // pg types
const router = express.Router();

class BaseRequestHandler {
  req:Express.Request;
  res:Response;
  inputs:any;
  db:any;
  nextPage:string;
  errPage:string;

  constructor(req:any, res:any, nextPage:string, errPage:string)  {
    this.req = req;
    this.res = res;
    this.inputs = req.query;
    this.db = req.db;
    this.nextPage = nextPage;
    this.errPage = errPage;
  }

  handler() {
    this.db.selectUser([this.inputs.email])
      .then((result) => {
        let user = new r.UserDB(result.rows[0]);
        return user;
      })
      .then((result:any) => {
        this.onSuccess(result);
      })
      .catch((error:Error) => {
        this.onFailure(error)
      })
  }

  onSuccess(renderObj:any) {
    return this.res.render(this.nextPage, renderObj)
  }

  onFailure(error:Error) {
    return this.res.render(this.errPage, { dbError: error })
  }
}


export { router, BaseRequestHandler };
