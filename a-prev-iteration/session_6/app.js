const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express')
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const pg = require('pg');
const path = require('path');
const { Client } = require('pg');
const { databaseInformation } = require('./database/database-information');
const client = new Client(databaseInformation);
const bcrypt = require('bcrypt');
const validation = require('./middleware/validation');
const session = require('express-session');
const sessionCheck = require('./middleware/session-check');
const dbMiddleware = require('../middleware/database');

var toAccountInformation = require('./routes/account-information');
var toChangeAccount = require('./routes/change-account');
var deleteAccount = require('./routes/delete-account');
var index = require('./routes/index');
var logOut = require('./routes/log-out');
var login = require('./routes/login');
var mailer = require('./routes/mailer')
var signUp = require('./routes/sign-up');
var shop = require('./routes/shop');

const app = express();
client.connect();
app.use(bodyParser.urlencoded({ extended: false }));

//view templating engine set up
app.engine('hbs', hbs({extname: 'hbs', defaultLayout:'layout', layoutsDir:__dirname + '/views/layouts'}));
app.set('views', './views');
app.set('view engine', "hbs");
app.use(express.static(path.join(__dirname, 'public')));
//session using memory storage for now. Will not be the case in production. see readme session stores
app.set('trust proxy', 1); // trust first proxy

app.use(session({
  cookieName:'session',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


app.use(dbMiddlware.init(databaseInformation));

app.use('/', toAccountInformation);
app.use('/', toChangeAccount);
app.use('/', deleteAccount);
app.use('/', index);
app.use('/', logOut);
app.use('/', login);
app.use('/', mailer);
app.use('/', signUp);
app.use('/', shop);

exports.login = function login(req, res, text, values){
  req.conn.query(text, values, (err, result) => {
  console.log('two');
    if (err) {
      console.log('three');
      var error = validation.errTranslator(err.constraint);
      res.render('login', { dbError: error });
    } else if (result.rowCount === 0) {
      console.log('three');
      res.render('login', { dbError: 'that email is not in the database' });
    } else {
      console.log('three');
      if (bcrypt.compareSync(req.body.password, result.rows[0].password)){
        // probably need to do something better than this
        req.session.user = [req.body.email, result.rows[0].password];
        console.log("on login", req.session);
        res.render('account-actions', {title: 'Hi,', email:req.session.user[0]});
      } else {
        console.log('four');
        res.render('login', { dbError: 'Password is wrong.' });
      }
    }
  })
}


https.createServer({
   key: fs.readFileSync('key.pem'),
   cert: fs.readFileSync('cert.pem'),
   passphrase: 'Mapex133'
 }, app).listen(3000, function () {
   console.log('App running');
 });


var exports = module.exports = {};
