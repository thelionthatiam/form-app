"use strict";
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
app.get('/alarms', function (req, res, next) {
    res.render('alarms', {});
});
module.exports = app;
//# sourceMappingURL=index.js.map