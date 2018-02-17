import * as express from 'express';
import {
  payPal,
  ach,
  aliPay,
  googlePlay,
  stripe } from '../../functions/transaction-calc';
import * as r from '../../resources/value-objects'
import * as mailer from '../../middleware/emailer'
const router = express.Router();

router.use('/transact', mailer.mailer())

router.route('/transact')
  .post((req, res) => {
    let dismisses:number;
    let unpaidDismisses:any;
    let dismissTot:number;
    let snoozes:number;
    let unpaidSnoozes:any;
    let snoozeTot:number;
    let wakes:number;
    let unpaidWakes:any;
    let wakeTot:number;
    let total:number;
    let payment_uuid:string;
    let recipient:UUID;
    let org_trans_total:number;
    let trans_uuid:UUID;
    let revenue:number;
    let snoozePrice: number;
    let dismissPrice: number;
    let wakePrice: number;

    let user = r.UserSession.fromJSON(req.session.user);

    req.aQuery.selectUnpaidSnoozes([user.uuid, false])
      .then((result) => {
        console.log('snoozes', result.rowCount)
        snoozes = result.rowCount
        unpaidSnoozes = result.rows
        return req.aQuery.selectUnpaidDismisses([user.uuid, false])
      })
      .then((result) => {
        console.log('dismisses', result.rowCount)
        dismisses = result.rowCount
        unpaidDismisses = result.rows
        return req.aQuery.selectUnpaidWakes([user.uuid, false])
      })
      .then((result) => {
        console.log('wakes', result.rowCount)
        wakes = result.rowCount
        unpaidWakes = result.rows
        return req.aQuery.selectUserOrgs([user.uuid])
      })
      .then((result) => {
        for (let i = 0; i < result.rows.length; i++) {
          let org = r.UserOrgsDB.fromJSON(result.rows[i])
          if (org.active) {
            recipient = org.org_uuid;
          }
        }
        return req.aQuery.selectUserSettings([user.uuid])
      })
      .then((result) => {
        let settings = r.UserSettings.fromJSON(result.rows[0])
        snoozePrice = parseFloat(settings.snooze_price);
        dismissPrice = parseFloat(settings.dismiss_price);
        wakePrice = parseFloat(settings.wake_price);

        snoozeTot = (snoozePrice * snoozes)
        dismissTot = (dismissPrice * dismisses)
        wakeTot = (wakePrice * wakes)
        total = ( snoozeTot + dismissTot + wakeTot )

        org_trans_total = stripe.orgCut(total);
        revenue = stripe.revenue(total);

        let inputs = [
              user.uuid,
              recipient,
              settings.active_payment,
              snoozes,
              dismisses,
              wakes,
              total
            ]

        return req.aQuery.insertTransaction(inputs)
      })
      .then((result) => {
        trans_uuid = result.rows[0].trans_uuid

        let payArr = [];

        for (let i = 0; i < unpaidSnoozes.length; i++ ) {
          let input = [ true, unpaidSnoozes[i].snooze_uuid]
          let promise = req.aQuery.snoozesToPaid(input);
          payArr.push(promise)
        }

        for (let i = 0; i < unpaidDismisses.length; i++ ) {
          let input = [ true, unpaidDismisses[i].dismiss_uuid]
          let promise = req.aQuery.dismissesToPaid(input);
          payArr.push(promise)
        }

        for (let i = 0; i < unpaidWakes.length; i++ ) {
          let input = [ true, unpaidWakes[i].wakes_uuid]
          let promise = req.aQuery.wakesToPaid(input);
          payArr.push(promise)
        }

        return Promise.all(payArr)
      })
      .then((info) => {
        return req.aQuery.insertOrgPayment([trans_uuid, user.uuid, recipient, org_trans_total, false])
      })
      .then((result) => {
        return req.aQuery.insertRevenue([trans_uuid, user.uuid, revenue])
      })
      .then((result) => {
        let mail = {
          from: 'juliantheberge@gmail.com',
          to: 'fffff@mailinator.com', // need to change back to user.email
          subject: 'Test',
          template: 'email/month-report',
          context: {
            snoozes:Math.trunc( snoozes ),
            snoozePrice:snoozePrice,
            dismisses:Math.trunc( dismisses ),
            dismissPrice:dismissPrice,
            wakes:Math.trunc( wakes ),
            wakePrice:wakePrice,
            total:total,
            organization:recipient,
          }
        }
        return req.transporter.sendMail(mail);
      })
      .then((info) => {
        console.log(info)
        res.redirect('/accounts/' + req.session.user.email + '/alarms');
      })
      .catch((error) => {
        console.log(error)
        throw new Error('there was an error: ' + error)
      })

  })


router.route('/pay-org')
  .post((req, res) => {
    let user = r.UserSession.fromJSON(req.session.user);
    let recipient:UUID;


    req.aQuery.selectUserOrgs([user.uuid])
      .then((result) => {
        for (let i = 0; i < result.rows.length; i++) {
          let org = r.UserOrgsDB.fromJSON(result.rows[i])
          if (org.active) {
            recipient = org.org_uuid;
          }
        }

        return req.aQuery.selectPendingPayments([recipient, false])
      })
      .then((result) => {
        let total:number;
        let unPaidTransactions:UUID[];

        for (let i = 0; i < result.rows.length; i++) {
          unPaidTransactions.push(req.aQuery.orgToPaid([true, result.rows[i].recipient]))
          total = total + result.rows[i].org_trans_total;
        }
        console.log(total)
        if (total > 5.00) { // determine threshold for sending money to org
          return Promise.all(unPaidTransactions)
        }
      })
      .then((result) => {

        res.redirect('/accounts/' + req.session.user.email + '/alarms')
      })
      .catch((error) => {
        console.log(error)
        res.redirect('/accounts/' + req.session.user.email + '/alarms')
      })

  })

module.exports = router;
// set paid to true
