import * as helper from '../functions/helpers';
import { ModRequest, ModResponse, PGOutput } from '../../typings/typings';
import { RequestHandler } from '../../node_modules/@types/express-serve-static-core/index'
import * as express from "express";

function check(req:Express.Request, res:ModResponse, next:Function) {
  var thisPage = 'login';

  if (req.session && req.session.user){
    var sessionInputs = req.session.user
    var inputs = {
      email:req.session.user.email,
      password:req.session.user.password,
      phone:req.session.user.phone
    }
    req.querySvc.selectSessionUser(inputs, (err:Error, result:PGOutput) => {
      if (err) {
        helper.dbError(res, thisPage, JSON.stringify(err));
      } else if (result.rowCount === 0) {
        helper.genError(res, thisPage, "something went wrong with the session, try to log in again");
      } else {
        next();
      }
    })
  } else {
    req.session = null;
    helper.genError(res, thisPage, "you were no longer logged in, try to log in again");
  }
}

export { check };
