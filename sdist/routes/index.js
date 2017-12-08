"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.use('/account', require('./account'));
app.use('/auth', require('./authorize'));
app.use('/auth', require('./mailer'));
app.use('/in-session', require('./manage-account'));
app.use('/in-session', require('./shop'));
// render home page
app.get('/', function (req, res, next) {
    console.log('sessionId:', req.session.user);
    res.render('index', { title: 'A pleasent form app', subtitle: 'Put all your cares aside' });
});
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
const async_database_1 = require("../middleware/async-database");
app.get('/alarms', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let thisPage = 'index';
    let nextPage = 'alarms';
    let user_uuid = 'ee53a4f7-c760-4cb0-9070-c5b11fca3f51';
    try {
        const { rows } = yield async_database_1.db.query('SELECT * FROM alarms WHERE user_uuid = $1', [user_uuid]);
        let awake = rows[0].awake, title = rows[0].title, thedate = rows[0].thedate;
        res.render(nextPage, { awake: awake, title: title, thedate: thedate });
    }
    catch (err) {
        next(err);
    }
}));
module.exports = app;
//# sourceMappingURL=index.js.map