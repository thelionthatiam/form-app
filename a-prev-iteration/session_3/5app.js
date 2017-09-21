const express = require('express')
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const pg = require('pg');
const path = require('path');
const { Client } = require('pg');
const { database_information } = require('./database/database_information');
const client = new Client(database_information);
// const bcrypt = require('bcrypt');
const validation = require('./validation');
const session = require('express-session');
// const sessionCheck = require('./session_check');
const app = express();

var index = require('./routes/index');
var to_sign_up = require('./routes/to_sign_up');
var to_login = require('./routes/to_login');
var shop = require('./routes/shop');
var to_account_information = require('./routes/to_account_information');
var back_acccount = require('./routes/back_account');
var change = require('./routes/change');


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
app.use('/', change);


//sends user information to database,
app.post('/sign_up', function(req, res, next) {

  var values = [req.body.email, req.body.phone, req.body.password];
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

//login to view account actions
app.post('/to_account_actions', function(req,res,next) {
  var text = 'SELECT * FROM users WHERE email = $1 AND password = $2';
  var values = [req.body.email, req.body.password];

  client.query(text, values, (err, result) => {
    if (err) {
      res.render('login', { dbError: err });

    } else if (result.rowCount === 0) {
      res.render('login', { dbError: 'that email and/or password combination is not in the database' });

    } else {

      if (req.body.password === result.rows[0].password){
        req.session.user = values;
        console.log("on login", req.session);
        res.render('account_actions', {title: 'hi',email:req.body.email});

      //this next step will never happen the way of coded it, but it will one day
      } else {
        res.render('login', { dbError: 'password probaby does not match email on file' });

      }
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
})



app.listen(3000, function () {
  console.log('App running');
})
