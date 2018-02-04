import { dbErrTranslator, compare } from '../../functions/helpers';
import * as express from 'express';
import { db } from '../../middleware/database';
const router = express.Router();

//////////////
////////////// SHOW/CREATE USERS
//////////////

router.route('/accounts')
  .get((req, res) => {
    let accountContent:any;
    let alarmContent:any;
    let alarmArray:any = [];
    let paymientContent;
    let paymentArray:any = [];
    let permission = false;

    if (req.session.user.permission === 'admin') {
      permission = true;
    } else {
      permission = false;
    }

    db.query("SELECT * FROM users", [])
      .then((result) => {
        accountContent = result.rows
        for (let i = 0; i < accountContent.length; i++) {
          alarmArray.push(db.query('SELECT * FROM alarms WHERE user_uuid = $1', [accountContent[i].user_uuid]))
        }
        return Promise.all(alarmArray);
      })
      .then((result) => {
        for (let i = 0; i < result.length; i++) {
          accountContent[i].alarmContent = result[i].rows
          for (let j = 0; j < accountContent[i].alarmContent.length; j++) {
            accountContent[i].alarmContent[j].permission = permission;
          }
        }
        for (let i = 0; i < accountContent.length; i++) {
          paymentArray.push(db.query('SELECT * FROM payment_credit WHERE user_uuid = $1', [accountContent[i].user_uuid]))
        }
        return Promise.all(paymentArray)
      })
      .then((result) => {
        for (let i = 0; i < result.length; i++) {
          accountContent[i].paymentContent = result[i].rows
          for (let j = 0; j < accountContent[i].paymentContent.length; j++) {
            accountContent[i].paymentContent[j].permission = permission;
            console.log(accountContent[i].paymentContent[j].permission)
          }
        }
        res.render('admin/accounts/accounts', {
          accountContent:accountContent,
        })
      })
      .catch((err) => {
        console.log(err)
        res.render('error', {
          errName: err.message,
          errMessage: null
        });
      });
  })

router.route('/accounts/:user_uuid')
  .delete((req, res) => {
    let user_uuid = req.body.user_uuid;

    let query = 'DELETE FROM users WHERE user_uuid = $1'
    let input = [user_uuid]

    db.query(query, input)
      .then((result) => {
        res
      })
      .catch((err) => {
        console.log(err.stack)
        res.render('error', { dbError: err.stack });
      });
  })


////////////
//////////// EDIT/DELETE USER CONTACT
////////////

router.route('/accounts/:user_uuid/contact')
  .get((req, res) => {
    let user_uuid = req.query.user_uuid;
    let permission = false;

    db.query("SELECT * FROM users WHERE user_uuid = $1", [user_uuid])
      .then((result) => {
        let user = result.rows[0]
        if (req.session.user.permission === 'admin') {
          permission = true;
        } else {
          permission = false;
        }

        res.render('account/my-contact', {
         phone:user.phone,
         email:user.email,
         permission:permission,
         user_uuid:user_uuid
        })
      })
      .catch((err) => {
        console.log(err.stack);
        res.render('error', { dbError: err.stack });
      });
    })
    .put((req, res) => {
      let email = req.body.a,
          phone = req.body.phone,
          user_uuid = req.body.user_uuid;

      let query = 'UPDATE users SET (email, phone) = ($1, $2) WHERE user_uuid = $3';
      let input = [email, phone, user_uuid];
      db.query(query, input)
        .then((result) => {
          res.redirect('/admin/accounts');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })
    .delete((req, res) => {
      let user_uuid = req.body.user_uuid;
      db.query('DELETE FROM users WHERE user_uuid = $1', [user_uuid])
        .then((result) => {
          res.redirect('/admin/accounts');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })

////////////
//////////// EDIT/DELETE USER ALARM
////////////


router.route('/accounts/:user_uuid/alarms/:alarm_uuid')
  .get((req, res) => {
    console.log('ALARM ACCOUNT ROUTE')
    let user_uuid = req.query.user_uuid;
    let alarm_uuid = req.query.alarm_uuid;
    let permission = false;
    let alarm;

    console.log(user_uuid,alarm_uuid, permission)
    db.query("SELECT * FROM alarms WHERE user_uuid = $1 AND alarm_uuid = $2", [user_uuid, alarm_uuid])
      .then((result) => {
        alarm = result.rows[0]
        console.log(alarm)

        if (req.session.user.permission === 'admin') {
          permission = true;
        } else {
          permission = false;
        }

        res.render('alarms/edit-alarm', {
         title:alarm.title,
         awake:alarm.awake,
         active:alarm.active,
         alarm_uuid:alarm_uuid,
         permission:permission,
         user_uuid:user_uuid
        })
      })
      .catch((err) => {
        console.log(err.stack);
        res.render('error', { dbError: err.stack });
      });
    })
    .put((req, res) => {
      let user_uuid = req.body.user_uuid;
      let alarm_uuid = req.body.alarm_uuid;
      let title = req.body.title;
      let awake = req.body.awake;
      let active = req.body.active;

      let query = 'UPDATE alarms SET (title, awake, active) = ($1, $2, $3) WHERE user_uuid = $4 AND alarm_uuid = $5';
      let input = [title, awake, active, user_uuid, alarm_uuid];

      db.query(query, input)
        .then((result) => {
          res.redirect('/admin/accounts');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })
    .delete((req, res) => {
      let user_uuid = req.body.user_uuid;
      let alarm_uuid = req.body.alarm_uuid;

      db.query('DELETE FROM alarms WHERE user_uuid = $1 AND alarm_uuid =$2', [user_uuid, alarm_uuid])
        .then((result) => {
          res.redirect('/admin/accounts');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })


////////////
//////////// EDIT/DELETE USER PAYMENTS
////////////
router.route('/accounts/:user_uuid/payment/:card_number')
  .get((req, res) => {
    let user_uuid = req.query.user_uuid;
    let card_number = req.query.card_number;
    let permission = false;
    let payment;

    console.log(user_uuid, card_number, permission);
    db.query("SELECT * FROM payment_credit WHERE user_uuid = $1 AND card_number = $2", [user_uuid, card_number])
      .then((result) => {
        payment = result.rows[0]
        console.log(payment)

        if (req.session.user.permission === 'admin') {
          permission = true;
        } else {
          permission = false;
        }

        res.render('payment/edit-payment', {
          name: payment.name,
          card_number: payment.card_number,
          exp_date: payment.exp_date,
          exp_month: payment.exp_month,
          cvv: payment.cvv,
          address_1: payment.address_1,
          city: payment.city,
          state: payment.state,
          zip: payment.zip,
          user_uuid:user_uuid,
          permission:permission
        })
      })
      .catch((err) => {
        console.log(err.stack);
        res.render('error', { dbError: err.stack });
      });
    })
    .put((req, res) => {
      let oldCard = req.body.oldCard;
      let inputs = {
        name:req.body.name,
        cardNumber:req.body.cardNumber,
        expDay:req.body.expDay,
        expMonth:req.body.expMonth,
        cvv:req.body.cvv,
        address:req.body.address,
        city:req.body.city,
        state:req.body.state,
        zip:req.body.zip,
      }
      let user_uuid = req.body.user_uuid;

      let query = 'UPDATE payment_credit SET (card_number, name, exp_month, exp_date, cvv, address_1, city, state, zip) = ($1, $2, $3, $4, $5, $6, $7, $8, $9) WHERE user_uuid = $10 AND card_number = $11';
      let input = [inputs.cardNumber, inputs.name, inputs.expMonth, inputs.expDay, inputs.cvv, inputs.address, inputs.city, inputs.state, inputs.zip, user_uuid, oldCard];

      db.query(query, input)
        .then((result) => {
          res.redirect('/admin/accounts');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })
    .delete((req, res) => {
      let user_uuid = req.body.user_uuid;
      let card_number = req.body.card_number

      let query = 'DELETE FROM payment_credit WHERE user_uuid = $1 AND card_number =$2'

      let input = [req.session.user.uuid, card_number]
      db.query(query, input)
        .then((result) => {
          res.redirect('/admin/accounts');
        })
        .catch((err) => {
          console.log(err.stack)
          res.render('error', { dbError: err.stack });
        });
    })

module.exports = router;
