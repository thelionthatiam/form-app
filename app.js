const fs = require('fs');
const https = require('https');
const http = require('http');
const express = require('express')
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const path = require('path');
const { databaseInformation } = require('./database-config/database-information');
const dbMiddleware = require('./middleware/database');
const session = require('express-session');
const sessionCheck = require('./middleware/session-check')
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
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
  saveUninitialized: true,
  cookie: { maxAge: 240000 }
}));

app.all('/in-session*', sessionCheck.check)
// exception: finds index automatically
app.use(require('./routes'))

app.use(function (err, req, res, next) {
  res.status(500).render('error', { err: err.stack });
})

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
