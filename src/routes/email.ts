// import * as fs from "fs";
// import * as help from '../functions/promise-helpers';
// import * as bcrypt from 'bcrypt';
// import { Inputs, PGOutput } from '../../typings/typings';
// import { transporter, mailOptions } from "../config/mail-config.js";

import * as coupons from '../functions/coupon-helpers'
import { lastFourOnly } from '../functions/promise-helpers'
import * as express from 'express';
import { db } from '../middleware/async-database';
import * as mailer from '../middleware/emailer'
const router = express.Router();

router.use('/test-route', mailer.mailer()) // middleware to load email junk
router.get('/test-route', (req, res) => {
  let uuid = '3e792f4c-1f49-4fcd-808c-fee4203ca056',
      cartContent:any[] = [],
      totalCost = 0,
      totalItems = 0,
      price,
      quantity,
      card_number:string,
      lastFour:string,
      discounted:number = 1,
      cart_uuid:string = '530e03ed-28be-47c1-a774-cff6486f0606',
      email:string = 'b@b.bb'

  db.query('SELECT p.product_id, name, price, size, description, discount FROM products p INNER JOIN cart_items c ON p.product_id = c.product_id AND (c.cart_uuid = $1)', [cart_uuid])
    .then((result) => {
      cartContent = result.rows
      for (let i = 0; i < cartContent.length; i++) {
        if (cartContent[i].discount === 0) {
          cartContent[i].isDiscount = false;
        } else (cartContent[i].discount > 0) {
          cartContent[i].isDiscount = true;
          cartContent[i].discount = ((cartContent[i].discount)*100)
        }
        cartContent[i].email = email;
      }
      return db.query('SELECT * FROM cart_items WHERE cart_uuid = $1', [cart_uuid])
    })
    .then((result) => {
      for (let i = 0; i < cartContent.length; i++) {
        for (let j = 0; j < result.rows.length; j++) {
          if (cartContent[i].product_id === result.rows[j].product_id) {
            cartContent[i].quantity = result.rows[j].quantity
          }
        }
        let discounted = coupons.percentOff(result.rows[i].discount, cartContent[i].price)
        console.log(discounted)
        price = discounted;
        quantity = parseInt(cartContent[i].quantity);
        totalCost = totalCost + (price * quantity);
        totalItems = totalItems + quantity;
        console.log(price, quantity, totalCost, totalItems)
      }
      return db.query('SELECT card_number FROM cart WHERE user_uuid = $1', [uuid])
    })
    .then((result) => {
      lastFour = lastFourOnly(result.rows[0].card_number);
      card_number = result.rows[0].card_number;

      return db.query('SELECT * FROM users', []);
    })
    .then((result) => {
      let  mail = {
                  from: 'juliantheberge@gmail.com',
                  to: 'fffff@mailinator.com',
                  subject: 'Test',
                  template: 'email/reciept',
                  context: {
                    cartContent:cartContent,
                    totalCost:totalCost,
                    totalItems:totalItems,
                    lastFour:lastFour,
                    card_number:card_number,
                    email:email,
                  }
              };

      return req.transporter.sendMail(mail)
      .then((info) => {
        console.log(info)
        res.render('login', {dbError:'mail sent, this is not an error'})
      })
    })
    .catch((err) => {
      console.log('test error', err);
      res.render('login', { dbError: err});
    });
})


// render forgot pass page
// router.get('/forgot-password', function (req, res, next) {
//   res.render('login', {
//     forgotPassword:true
//   });
// })
//
// router.route('/forgot-password/authorized')
//   .post((req, res) => {
//     let uuid = '';
//     let nonce = '';
//     let email = req.body.email;
//
//
//     db.query("SELECT * FROM users WHERE email = $1", [email])
//       .then((result) => {
//         if (result.rows.length === 0) {
//           console.log('should have error');
//           throw new Error("Email not found");
//         } else {
//           uuid = result.rows[0].user_uuid
//           return help.randomString
//         }
//       })
//       .then((string) => {
//         return bcrypt.hash(string, 10)
//       })
//       .then((hash) => {
//         nonce = hash
//         return db.query('UPDATE nonce SET nonce = $1, thetime = default WHERE user_uuid = $2', [hash, uuid])
//       })
//       .then((result) => {
//         req.session.uuid = uuid;
//         req.session.token = nonce;
//         mailOptions.to = email;
//         // doesn't have any content in the email anymore, use html
//         return transporter.sendMail(mailOptions)
//       })
//       .then((result) => {
//         res.render('login', {
//           forgotPassword:true,
//           message: "check your email to authorize new password!"
//         })
//       })
//       .catch((error) => {
//         res.render('login', { forgotPassword:true, dbError: error })
//       })
//     })
//
//     .get((req, res) => {
//       let uuid = req.session.uuid
//       db.query('SELECT * FROM nonce WHERE user_uuid = $1', [uuid])
//         .then((result) => {
//           if (result.rows.length === 0) {
//             throw new Error("Account not found.")
//           } else {
//             var outputs = result.rows[0];
//             var token = req.session.token;
//             return help.isSessionValid(token, outputs)
//           }
//         })
//         .then((result) => {
//           if (result) {
//             res.render('new-password', {
//               forgotPassword:true,
//               email:req.session.uuid,
//             })
//           }
//         })
//         .catch((error) => {
//           console.log(error)
//           res.render('login', { dbError: error })
//         })
//     })
//     .put((req, res) => {
//       let password = req.body.password;
//       let uuid = req.session.uuid;
//       bcrypt.hash(password, 10)
//         .then((hash) => {
//           console.log(hash)
//           password = hash;
//           return db.query('UPDATE users SET password = $1 WHERE user_uuid = $2', [password, uuid])
//         })
//         .then((result) => {
//             console.log(result);
//             res.render('login', {
//               message:"try your new password"
//             })
//         })
//         .catch((error) => {
//           res.render('new-password', { forgotPassword:true, dbError: error, email:req.session.uuid })
//         })
//     })

module.exports = router;
