import * as express from 'express';
import * as help from '../functions/helpers';
import * as bcrypt from 'bcrypt';
import * as uuidv4 from 'uuid/v4';
import { BaseRequestHandler } from './test'
import { db } from '../middleware/database'
// import * as r from '../config/resources'
const router = express.Router();



router.route('/authorized')
  .post((req, res) => {
    console.log('auth running')
    let input:Inputs = {};
    let cart_uuid;

    db.query("SELECT * FROM users WHERE email = $1", [req.body.email])
      .then((result) => {
        if (result.rows.length === 0) {
          console.log()
          throw new Error("Email not found")
        } else {
          input = result.rows[0];
          console.log(input)
          return bcrypt.compare(req.body.password, result.rows[0].password)
        }
      })
      .then((result) => {
        if (result === false) {
          throw new Error('Password incorrect');
        } else {
          console.log(req.sessionID)
          return help.regenerateSession(req);
        }
      })
      .then(() => {
        return db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [req.sessionID, input.user_uuid]);
      })
      .then((result) => {
        console.log(result)
        return db.query('SELECT cart_uuid FROM cart WHERE user_uuid = $1', [input.user_uuid])
      })
      .then((result) => {
        cart_uuid = result.rows[0].cart_uuid;
        req.session.user = {
          email:input.email,
          uuid:input.user_uuid,
          cart_uuid:cart_uuid,
          permission:input.permission,
          name:input.name
        }
        console.log(req.session.user)
        return db.query('select NOW()', [])
      })
      .then((result) => {
        if (req.session.user.permission === 'admin') {
          res.render('admin/home')
        } else if (req.session.user.permission === 'user') {
          res.render('home', {
            email:req.session.user.email,
            name:req.session.user.name
          })
        }
      })
      .catch((error) => {
        console.log(error)
        res.render('login', { dbError:error })
      })
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

//
//
// interface AuthInputs {
//   email:'string';
//   password:'string';
// }
//
// interface AuthRender {
//   email:string;
// }
//
// class AuthHandler extends BaseRequestHandler {
//   inputs:AuthInputs;
//
//   constructor(req:any, res:any, nextPage:string, errPage:string)  {
//     super(req, res, nextPage, errPage);
//     this.inputs = req.body;
//   }
//
//   handler() {
//     let renderObj:AuthRender;
//     let user:r.UserDB;
//     let cart:r.CartDB;
//     let userSession:r.UserSession;
//
//     this.aQuery.selectUser([this.inputs.email])
//       .then((result) => {
//         if (result.rows.length === 0) {
//           throw new Error("Email not found");
//         } else {
//           user = new r.UserDB(result.rows[0]);
//           return bcrypt.compare(this.inputs.password, user.password);
//         }
//       })
//       .then((result) => {
//         if (result === false) {
//           throw new Error('Password incorrect');
//         } else {
//           return help.regenerateSession(this.req);
//         }
//       })
//       .then(() => {
//         return this.aQuery.updateSessionID([this.req.sessionID, user.user_uuid]);
//       })
//       .then((result) => {
//         return this.aQuery.selectCart([user.user_uuid]);
//       })
//       .then((result) => {
//         cart = new r.CartDB(result.rows[0]);
//
//         userSession = {
//           email:user.email,
//           uuid:user.user_uuid,
//           permission:user.permission,
//           cart_uuid:cart.cart_uuid
//         }
//
//         this.req.session.user = userSession;
//         renderObj = { email:user.email };
//
//
//         if (user.permission === 'admin') {
//           this.res.render('admin/home')
//         } else if (user.permission === 'user') {
//           this.onSuccess(result);
//         }
//       })
//       .catch((error:Error) => {
//         this.onFailure(error)
//       })
//
//   }
// }
// router.post('/authorized', (req, res) => {
//   let auth = new AuthHandler(req, res, 'home', 'login')
//   auth.handler();
// })
