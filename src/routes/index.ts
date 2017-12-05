import * as fs from "fs";
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

module.exports = app;
