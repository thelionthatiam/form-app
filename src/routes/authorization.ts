import * as express from 'express';
import * as help from '../functions/promise-helpers';
import * as bcrypt from 'bcrypt';
import { Inputs } from '../../typings/typings';
import { db } from '../middleware/async-database';
import * as uuidv4 from 'uuid/v4';
import { BaseReqestHandler } from './test'
import { UserDB, OrderDB, CartDB, SessionDB, User } from '../config/resources'
const router = express.Router();


// class AuthHandler extends BaseReqestHandler {
//   userSelect:string;
//   updateSessionID:string;
//   selectCartID:string;
//   input:any;
//
//   constructor(req:Express.Request, res:Response, query:string[], input:any, nextPage:string, errPage:string)  {
//     super(req, res, query, input, nextPage, errPage);
//     this.userSelect = 'SELECT * FROM users WHERE email = $1';
//     this.updateSessionID = 'UPDATE session SET sessionid = $1 WHERE user_uuid = $2';
//     this.selectCartID = 'SELECT cart_uuid FROM cart WHERE user_uuid = $1';
//     this.input = req.body;
//   }
//
//   promises() {
//     let user:UserDB;
//     let cart:CartDB;
//     let sessionU:User;
//     let renderObj:any;
//
//     return this.db.query(this.userSelect, this.input.email)
//       .then((result) => {
//         user = new UserDB(result.rows[0]);
//
//         if (result.rows.length === 0) {
//           throw new Error("Email not found")
//         } else {
//           return bcrypt.compare(this.input.password, user.password)
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
//         return db.query(this.updateSessionID, [this.req.sessionID, user.user_uuid]);
//       })
//       .then((result) => {
//         return db.query(this.selectCartID, [user.user_uuid])
//       })
//       .then((result) => {
//         cart = new CartDB(result.rows[0])
//
//         this.req.session.user = {
//           email:user.email,
//           uuid:user.user_uuid,
//           permission:user.permission,
//           cart_uuid:cart.cart_uuid
//         }
//
//         sessionU = new User(this.req.session.user);
//         // this will probably need to be initialized every route..
//         return renderObj = help.merger(user, cart)
//       })
//   }
//
//   onSuccess() {
//     this.db.release();
//     function success() {
//       if (sessionU.permission === 'admin') {
//         this.res.render('admin/home')
//       } else if (sessionU.permission === 'user') {
//         this.res.render('home', {
//           email:this.req.session.user.email
//         })
//       }
//     }
//     return success();
//   }
//
// }
//
//
// router.post('/authorized', (req, res) => {
//   // h
//   let run = new AuthHandler()
// })



router.route('/authorized')
  .post((req, res) => {
    let input:Inputs = {};
    let cart_uuid;

    db.query("SELECT * FROM users WHERE email = $1", [req.body.email])
      .then((result) => {
        if (result.rows.length === 0) {
          throw new Error("Email not found")
        } else {
          input = result.rows[0];
          return bcrypt.compare(req.body.password, result.rows[0].password)
        }
      })
      .then((result) => {
        if (result === false) {
          throw new Error('Password incorrect');
        } else {
          return help.regenerateSession(req);
        }
      })
      .then(() => {
        return db.query('UPDATE session SET sessionid = $1 WHERE user_uuid = $2', [req.sessionID, input.user_uuid]);
      })
      .then((result) => {
        return db.query('SELECT cart_uuid FROM cart WHERE user_uuid = $1', [input.user_uuid])
      })
      .then((result) => {
        cart_uuid = result.rows[0].cart_uuid;
        req.session.user = {
          email:input.email,
          uuid:input.user_uuid,
          cart_uuid:cart_uuid,
          permission:input.permission
        }

        return req.db.query('select NOW()')
      })
      .then((result) => {
        console.log(result)
        if (req.session.user.permission === 'admin') {
          res.render('admin/home')
        } else if (req.session.user.permission === 'user') {
          res.render('home', {
            title:"yo",
            email:req.session.user.email
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
