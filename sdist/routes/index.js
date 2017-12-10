"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.use('/account', require('./account'));
app.use('/auth', require('./authorize'));
app.use('/auth', require('./mailer'));
app.use('/in-session', require('./manage-account'));
app.use('/in-session', require('./shop'));
// import * as exphbs from 'express-handlebars';
// import * as Handlebars from 'handlebars'
// render home page
app.get('/', function (req, res, next) {
    console.log('sessionId:', req.session.user);
    res.render('index', {
        title: 'A pleasent form app',
        subtitle: 'Put all your cares aside',
    });
});
const async_database_1 = require("../middleware/async-database");
function terribleString(title, awake, thedate) {
    return '<div class="column categoryWrapper"><div class="row categoryTitle"><h4>' + title + '</h4><div class="time-wrapper flex space-around "><p class="self right">' + awake + '</p><img src="https://png.icons8.com/ios/540/alarm-clock.png" /></div></div><div class="box subCategoryWrapper none"><div class="row subCategoryTitle"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Power_icon_%28the_Noun_Project_35084%29.svg/2000px-Power_icon_%28the_Noun_Project_35084%29.svg.png" /><img src="https://maxcdn.icons8.com/Share/icon/p1em/Editing//edit1600.png" /><img src="https://maxcdn.icons8.com/Share/icon/Media_Controls//high_volume1600.png" /><img src="https://www.pngarts.com/files/1/X-Shape-PNG-High-Quality-Image.png" /></div><div class="row date-created"><p>' + thedate + '</p></div></div></div>';
}
function alarmTableToHTML(array) {
    let alarmDivArray;
    console.log(array);
    for (let i = 0; i < array.length; i++) {
        let awake = array[i].awake, thedate = array[i].thedate, title = array[i].title;
        alarmDivArray.push(terribleString(title, awake, thedate));
    }
    console.log(alarmDivArray);
    return alarmDivArray.join('');
}
app.get('/alarms', (req, res, next) => {
    let thisPage = 'index';
    let nextPage = 'alarms';
    let userUUID = ['ee53a4f7-c760-4cb0-9070-c5b11fca3f51'];
    console.log('alarms');
    async_database_1.db.query("SELECT * FROM alarms WHERE user_uuid = $1", userUUID)
        .then((result) => {
        let alarmContent = result.rows;
        res.render(nextPage, {
            alarmContent: alarmContent,
            helpers: {
                alarmTableToHTML: function (array) {
                    let alarmDivArray = [];
                    for (let i = 0; i < array.length; i++) {
                        let awake = array[i].awake, thedate = array[i].thedate, title = array[i].title;
                        alarmDivArray.push(terribleString(title, awake, thedate));
                    }
                    return alarmDivArray.join('');
                }
            },
        });
    })
        .catch((err) => {
        res.render('error', {
            errName: err.message,
            errMessage: null
        });
    });
});
app.post('/create-alarm', (req, res, next) => {
    let inputs = {
        userUUID: 'ee53a4f7-c760-4cb0-9070-c5b11fca3f51',
        title: req.body.title,
        awake: req.body.awake
    };
    console.log([inputs.userUUID, inputs.title, inputs.awake]);
    async_database_1.db.query('INSERT INTO alarms(user_uuid, title, awake) VALUES ($1, $2, $3) RETURNING *', [inputs.userUUID, inputs.title, inputs.awake])
        .then((result) => {
        let alarmContent = result.rows;
        res.redirect('alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
    });
});
module.exports = app;
//# sourceMappingURL=index.js.map