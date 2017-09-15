const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express')
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const hbs = require('express-handlebars');
const pg = require('pg');
const path = require('path');
const { Client } = require('pg');
const { database_information } = require('./database/database_information');
const client = new Client(database_information);
const bcrypt = require('bcrypt');
const validation = require('./validation');
const session = require('express-session');
const sessionCheck = require('./session_check');
const app = express();

var index = require('./routes/index');
var to_sign_up = require('./routes/to_sign_up');
var to_login = require('./routes/to_login');
var shop = require('./routes/shop');
var to_account_information = require('./routes/to_account_information');
var back_acccount = require('./routes/back_account');
var toChangeAccount = require('./routes/to_change_account');
var mailer = require ('./routes/mailer')

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

app.use('/', index);
app.use('/', to_sign_up);
app.use('/', to_login);
app.use('/', shop);
app.use('/', to_account_information);
app.use('/', back_acccount);
app.use('/', toChangeAccount);
app.use('/', mailer);

//sends user information to database,
app.post('/sign_up', function (req, res, next) {
  var password = bcrypt.hashSync(req.body.password, 10);
  var values = [req.body.email, req.body.phone, password];
  var text = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';

  client.query(text, values, (err, result) => {

    if (err) {
      console.log(err);
      var error = validation.errTranslator(err.constraint);
      res.render('sign_up', { dbError: error, success:false });

    } else {
      res.render('sign_up', {success: true, email: req.body.email, phone: req.body.phone });

    }
  });
})

// login and set cookie data
app.post('/to_account_actions', function(req,res,next) {
  var text = 'SELECT * FROM users WHERE email = $1';
  var values = [req.body.email];

  client.query(text, values, (err, result) => {
    if (err) {
      var error = validation.errTranslator(err.constraint);
      res.render('login', { dbError: error });
    } else if (result.rowCount === 0) {
      res.render('login', { dbError: 'that email is not in the database' });
    } else {
      if (bcrypt.compareSync(req.body.password, result.rows[0].password)){
        // probably need to do something better than this
        req.session.user = [req.body.email, result.rows[0].password];
        console.log("on login", req.session);
        res.render('account_actions', {title: 'Hi,', email:req.session.user[0]});
      } else {
        res.render('login', { dbError: 'Password is wrong.' });
      }
    }
  })
})


// delete account
app.post('/delete', function (req, res, next) {
  var text = "DELETE FROM users WHERE email = $1"
  var values = [req.session.user[0]];
  client.query( text, values, function (err, result) {
    if (err) {
      console.log(err);
      res.render('account_info', {dbError: "Could not delete, try again." })
    } else {
      res.render('index', {title:"A pleasent form app", subtitle:"Welcome back!" });
    }
  })
})

// loging out
app.get('/to_log_out', function (req,res,next) {
  req.session.destroy(function(err) {
    if (err) {
      res.json(err.stack);
    } else {
      req.session = null;
      console.log("on logout", req.session);
      res.render('index', {title:"A pleasent form app", subtitle:"Welcome back!" });
    }
  })
});

// change email
app.post('/change_email', function (req, res, next) {
  var text = "UPDATE users SET email = $1 WHERE email = $2"
  var values = [req.body.email, req.session.user[0]];

  client.query(text, values, function(err, result) {
    if(err) {
      console.log(err);
      res.render('account_info', {dbError: "Could not delete, try again." });
    } else {
      console.log(result);
      req.session.user[0] = req.body.email
      sessionCheck.sessionCheck(req, function(resultingRow) {
        res.render('account_info', {
          subtitle: 'email updated',
          email: resultingRow.email,
          phone: resultingRow.phone,
          changeEmail:false
        });
      })
    }
  })
})

// change phone
app.post('/change_phone', function (req, res, next) {
  var text = "UPDATE users SET phone = $1 WHERE email = $2"
  console.log(req.body.phone, req.session.user[0]);
  var values = [req.body.phone, req.session.user[0]];

  client.query(text, values, function(err, result) {
    if(err) {
      console.log(err);
      res.render('account_info', {dbError: "Could not delete, try again." });
    } else {
      console.log(result);
      sessionCheck.sessionCheck(req, function(resultingRow) {
        res.render('account_info', {
          subtitle: 'phone number updated',
          email: resultingRow.email,
          phone: resultingRow.phone,
          changePhone:false
        });
      })
    }
  })
})

app.post('/change_password', function (req, res, next) {
  console.log(req.body.change_password)
  var password = bcrypt.hashSync(req.body.change_password, 10);
  var text = "UPDATE users SET password = $1 WHERE email = $2"
  var values = [password, req.session.user[0]];

  client.query(text, values, function(err, result) {
    console.log(result)
    if(err) {
      console.log(err);
      res.render('account_info', {dbError: "Could not delete, try again." });
    } else {
      req.session.user[1] = password
      console.log(req.session.user)
      sessionCheck.sessionCheck(req, function(resultingRow) {
        res.render('account_info', {
          subtitle: 'password updated',
          email: resultingRow.email,
          phone: resultingRow.phone,
          changePassword:false
        });
      })
    }
  })
})

https.createServer({
     key: fs.readFileSync('key.pem'),
     cert: fs.readFileSync('cert.pem'),
     passphrase: 'Mapex133'
   }, app).listen(3000, function () {
     console.log('App running');
   });
