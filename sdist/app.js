"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const path = require("path");
const combiner_1 = require("./config/combiner");
const database_1 = require("./middleware/database");
const session = require("express-session");
const sessionCheck = require("./middleware/session-check");
const app = express();
app.use(bodyParser.urlencoded({ extended: false, limit: '50kb' }));
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: "layout" }));
app.set('views', path.join(__dirname, "../views"));
app.set('view engine', "hbs");
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1);
app.use(database_1.init(combiner_1.dbConfig));
console.log(combiner_1.dbConfig);
//session using memory storage for now. Will not be the case in production. see readme session stores
app.use(session({
    name: 'session',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 240000 }
}));
app.all('/in-session*', sessionCheck.check);
app.use('/', require('./routes/index'));
app.use(function (req, res, next) {
    res.status(404);
    res.render('error', { errName: null, errMessage: "We couldn't find this page." });
});
app.use(function (err, req, res, next) {
    console.log('err name: ', err.name);
    console.log(err);
    if (err.name === 'PayloadTooLargeError') {
        res.status(413);
        res.render('error', { errName: err.message, errMessage: "You entered something over 50kb. Please make your inputs are smaller and try again." });
    }
    else if (err.name === 'ReferenceError') {
        res.status(500);
        res.render('error', { errName: err.message, errMessage: "Something was missing." });
    }
    else {
        res.status(500);
        res.render('error', { errName: err.message, errMessage: null });
    }
});
// production
// app.listen(8000, '172.31.31.153')
// localhost
app.listen(8000, 'localhost', function () {
    console.log('app is running');
});
// // easy switch to https
// http.createServer({
//    key: fs.readFileSync('key.pem'),
//    cert: fs.readFileSync('cert.pem'),
//    passphrase: 'Mapex133'
//  },
//   app).listen(3000, function () {
//    console.log('App running');
//  });
//# sourceMappingURL=app.js.map