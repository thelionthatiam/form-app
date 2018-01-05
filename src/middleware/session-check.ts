import * as helper from '../functions/helpers';
import { ModRequest, ModResponse, PGOutput } from '../../typings/typings';
import { RequestHandler } from '../../node_modules/@types/express-serve-static-core/index'
import * as session from "express-session";
import * as express from "express";
const router = express.Router();


function check(req:Express.Request, res:ModResponse, next:Function) {
  if (req.session && req.session.user && req.session.cookie){
    console.log(req.session.cookie)
    next();
  } else {
    req.session = null;
    helper.genError(res, 'login', "you were no longer logged in, try to log in again");
  }
}

export { check };
