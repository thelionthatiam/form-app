//wrap everything in use-strict so I don't have to type it every time
require('strict-mode') (function() {
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

app.use(bodyParser.urlencoded({ extended: false,limit:'50kb'}));
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

app.use(function(req, res, next) {
  console.log("statusCode: ", res.statusCode);
  res.status(404);
  console.log("statusCode: ", res.statusCode);
  res.render('error', { title: "404 ERROR:", err: "Sorry, couldn't find this page. Go back home." });
});

app.use(function(err, req,res,next) {
  console.log("statusCode: ", res.statusCode);
  res.status(413);
  console.log("statusCode: ", res.statusCode);
  res.render('error', { title: "413 ERROR:", err: "You typed in something over 50kb, that was not necessary. Start over and try something more reasonable."});
})

app.use(function (err, req, res, next) {
  console.log("statusCode: ", res.statusCode);
  res.status(500);
  console.log("statusCode: ", res.statusCode);
  console.log(err.stack)
  res.render('error', { title: "500 ERROR:", err: "Woah, something broke. Go back home." });
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
});
