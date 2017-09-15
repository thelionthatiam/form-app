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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));



//render home page
app.get('/', function (req, res) {
  res.render('index', { title: 'A pleasent form app', subtitle:'put all your cares aside' });
  req.session.errors = null;
})

//to sign up page
app.get('/to_sign_up', function(req, res, next) {
  res.render('sign_up', { success: false, errors: req.session.errors });
  req.session.errors = null;
});


app.post('/sign_up', function(req, res, next) {

  var values = [req.body.email, req.body.phone, req.body.password];
  var text = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';

  client.query(text, values, (err, result) => {

    if (err) {
      var err = validation.errTranslator(err.constraint);
      res.render('sign_up', { dbError: err });
    } else {
      app.use(session({
        genid: function(req) {
          return genuuid() // use UUIDs for session IDs
        },
        secret: 'keyboard cat'
      }))
      req.session.user = req.body.email;
      res.render('success', { email: req.body.email } );
    }
  });
})


function queryFixer (string) {

}

//my account page route
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

app.get('/shop', function(req,res,next) {
  res.render('shop', { success:true });
});


app.listen(3000, function () {
  console.log('Form listening on port 3000');
})
