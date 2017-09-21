const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express')
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const path = require('path');
const { databaseInformation } = require('./database-config/database-information');
const validation = require('./middleware/validation');
const dbMiddleware = require('./middleware/database');
const session = require('express-session');
const sessionCheck = require('./middleware/session-check')
//routes
const toAccountInformation = require('./routes/inSession/account-information');
// const toChangeAccount = require('./routes/inSession/change-account');
// const deleteAccount = require('./routes/inSession/delete-account');
const index = require('./routes/index');
const login = require('./routes/login');
// const mailer = require('./routes/inSession/mailer')
// const createAccount = require('./routes/create-account');
// const shop = require('./routes/inSession/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//view templating engine set up
app.engine('hbs', hbs({extname: 'hbs', defaultLayout:'layout', layoutsDir:__dirname + '/views/layouts'}));
app.set('views', './views');
app.set('view engine', "hbs");
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1);
app.use(dbMiddleware.init(databaseInformation));

//session using memory storage for now. Will not be the case in production. see readme session stores
app.use(session({
  cookieName:'session',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.all('/inSesssion/*', sessionCheck.check)

app.use('/', toAccountInformation);
// app.use('/', toChangeAccount);
// app.use('/', deleteAccount);
app.use('/', index);
app.use('/', login);
// app.use('/', mailer);
// app.use('/', createAccount);
// app.use('/', shop);


app.listen(3000, function () {
  console.log('app initialized');
})

// // easy switch to https
// http.createServer({
//    key: fs.readFileSync('key.pem'),
//    cert: fs.readFileSync('cert.pem'),
//    passphrase: 'Mapex133'
//  },
//   app).listen(3000, function () {
//    console.log('App running');
//  });
