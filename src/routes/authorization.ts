import * as express from 'express';
import * as help from '../functions/helpers';
import * as bcrypt from 'bcrypt';
import * as uuidv4 from 'uuid/v4';
import * as r from '../resources/value-objects'
import { watchAlarms } from '../functions/alarm'
import { BaseRequestHandler } from '../resources/handlers';
import { db } from '../middleware/database';

const router = express.Router();

class AuthHandler extends BaseRequestHandler {
  inputs:AuthInputs;

  constructor(req:any, res:any, nextPage:string, errPage:string)  {
    super(req, res, nextPage, errPage);
    this.inputs = req.body;
  }

  handler() {
    let renderObj:AuthRender;
    let user:r.UserDB;
    let cart:r.CartDB;
    let userSession:r.UserSession;

    this.aQuery.selectUser([this.inputs.email])
      .then((result) => {
        if (result.rows.length === 0) {
          throw new Error("Email not found");
        } else {
          user = r.UserDB.fromJSON(result.rows[0]);
          return bcrypt.compare(this.inputs.password, user.password);
        }
      })
      .then((result : boolean) => {
        if (result === false) {
          throw new Error('Password incorrect');
        } else {
          return help.regenerateSession(this.req);
        }
      })
      .then(() => {
        return this.aQuery.updateSessionID([this.req.sessionID, user.user_uuid]);
      })
      .then((result ) => {

        userSession = r.UserSession.fromJSON({
          email:user.email,
          uuid:user.user_uuid,
          permission:user.permission,
          name:user.name
        })

        this.req.session.user = userSession;

        watchAlarms(userSession);

        renderObj = {
          email:user.email,
          name:user.name
         };

        if (user.permission === 'admin') {
          this.res.render('admin/home')
        } else if (user.permission === 'user') {
          this.onSuccess(renderObj);
        }
      })
      .catch((error:Error) => {
        console.log(error)
        this.onFailure(error)
      })

  }
}

router.post('/authorized', (req, res) => {
  let auth = new AuthHandler(req, res, 'home', 'login')
  auth.handler();
})

router.post('/log-out', function(req, res, next) {
    let inactive = uuidv4(); //if its uuidv4 its inactive
    db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [inactive, req.session.user.uuid])
    .then((result) => {
      req.session.destroy(function(err:Error) {
        if (err) {
          res.render('error', { errName: err.message, errMessage: null });
        } else {
          console.log("after destory", req.session)
          res.render('login');
        }
      });
    })
  });

module.exports = router;
