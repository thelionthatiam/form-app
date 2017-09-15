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
const app = express();

var index = require('./routes/index');
var to_sign_up = require('./routes/to_sign_up');
var to_login = require('./routes/to_login');
var shop = require('./routes/shop');
var to_account_actions = require('./routes/to_account_actions');

client.connect();
app.use(bodyParser.urlencoded({ extended: false }));

//view templating engine set up
app.engine('hbs', hbs({extname: 'hbs', defaultLayout:'layout', layoutsDir:__dirname + '/views/layouts'}));
app.set('views', './views');
app.set('view engine', "hbs");
app.use(express.static(path.join(__dirname, 'public')));
//session using memory storage for now. Will not be the case in production. see readme session stores
app.set('trust proxy', 1); // trust first proxy

app.use('/', index);
app.use('/', to_sign_up);
app.use('/', to_login);
app.use('/', shop);
app.use('/', to_account_actions);

app.use(session({
  cookieName:'session',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

//sends user information to database,
app.post('/sign_up', function(req, res, next) {

  var values = [req.body.email, req.body.phone, req.body.password];
  var text = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';

  client.query(text, values, (err, result) => {

    if (err) {
      var err = validation.errTranslator(err.constraint);
      res.render('sign_up', { dbError: err });
    } else {
      req.session.user = req.body.email;
      res.render('sign_up', null);
    }
  });

})

app.get('/to_log_out', function (req,res,next) {
  req.session.destroy(function(err) {
    if (err) {
      res.json(err.stack);
    } else {
      res.render('index', {title:"A pleasent form app", subtitle:"back for another go" });
    }
  })
})

//to login
app.post('/to_account_actions', function(req,res,next) {
  var text = 'SELECT * FROM users WHERE email = $1 AND password = $2';
  var values = [req.body.email, req.body.password];
  client.query(text, values, (err, result) => {
    if (err) {
      var err = validation.errTranslator(err.constraint);
      res.render('login', { dbError: 'that email and/or password combination is not in the database' });
      // probably something like 'invalid username or pass'
    } else {
      var obj = result.rows[0];
      if (req.body.password === obj.password){
        // redirect to account_info
        req.session.user = obj.email;
        console.log(req.session);
        res.render('account_actions', {title: 'hi',email:req.body.email});
      } else {
        var err = validation.errTranslator(err.constraint);
        res.render('login', { dbError: 'password probaby does not match email on file' });
        // send password doesn't match email on file
      }
    }
  })
})

//to accoun information 
app.post('/to_account_info', function(req,res,next) {
  var text = 'SELECT * FROM users WHERE email = $1';
  var values = [req.session.user];

  client.query(text, values, (err, result) => {
    if (err) {
      res.json(err.stack);
    } else {
      var obj = result.rows[0];
      console.log(obj.email, obj.phone, obj.password);
      res.render('account_info', {
        title:" Account information",
        subtitle: "click change if you need to fix something",
        email: obj.email,
        phone: obj.phone,
        password: obj.password
      });
    }
  })
})

app.listen(3000, function () {
  console.log('App running');
})
