import * as fs from "fs";
import * as helper from '../functions/helpers';
import { Inputs, PGOutput, ModRequest } from '../../typings/typings';
import * as express from 'express';
const app = express();

app.use('/account', require('./account'))
app.use('/auth', require('./authorize'))
app.use('/auth', require('./mailer'));
app.use('/in-session', require('./manage-account'));
app.use('/in-session', require('./shop'));

// render home page
app.get('/', function (req, res, next) {
  console.log('sessionId:', req.session.user);
  res.render('index', { title: 'A pleasent form app', subtitle:'Put all your cares aside' });
})


// starting my async/await adventure here

// app.get('/alarms', function (req, res, next) {
//   let thisPage = 'index';
//   let nextPage = 'alarms';
//   var inputs = {
//     user_uuid:'ee53a4f7-c760-4cb0-9070-c5b11fca3f51'
//   }
//
//   req.querySvc.selectAlarmViaEmail(inputs, (err:Error, result: PGOutput) => {
//     if (err) {
//       helper.dbError(res, thisPage, JSON.stringify(err));
//     } else {
//       console.log(result.rows[0]);
//       let output = {
//         awake:result.rows[0].awake,
//         thedate:result.rows[0].thedate,
//         title:result.rows[0].title
//       }
//
//       res.render(nextPage, {awake:output.awake, title:output.title, thedate:output.thedate});
//     }
//   })
//
// })

import { db } from '../middleware/async-database';

app.get('/alarms', async (req, res, next) => {
  let thisPage = 'index';
  let nextPage = 'alarms';
  let user_uuid = 'ee53a4f7-c760-4cb0-9070-c5b11fca3f51';
  try {
    const { rows } = await db.query('SELECT * FROM alarms WHERE user_uuid = $1', [user_uuid])
    let awake = rows[0].awake,
        title = rows[0].title,
        thedate = rows[0].thedate;
    res.render(nextPage, {awake:awake, title:title, thedate:thedate});

  } catch(err) {
    next(err);
  }
})




module.exports = app;
