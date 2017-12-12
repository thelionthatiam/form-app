"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const async_database_1 = require("../middleware/async-database");
app.get('/alarms', (req, res, next) => {
    let thisPage = 'index';
    let nextPage = 'alarms';
    let userUUID = [req.user.userID];
    async_database_1.db.query("SELECT * FROM alarms WHERE user_uuid = $1", userUUID)
        .then((result) => {
        let alarmContent = result.rows;
        res.render(nextPage, { alarmContent: alarmContent });
    })
        .catch((err) => {
        res.render('error', {
            errName: err.message,
            errMessage: null
        });
    });
});
app.get('/add-alarm', (req, res, next) => {
    let thisPage = 'index';
    let nextPage = 'add-alarm';
    res.render(nextPage);
});
app.post('/create-alarm', (req, res, next) => {
    let inputs = {
        userUUID: req.user.userID,
        title: req.body.title,
        awake: req.body.awake
    };
    console.log([inputs.userUUID, inputs.title, inputs.awake]);
    async_database_1.db.query('INSERT INTO alarms(user_uuid, title, awake) VALUES ($1, $2, $3) RETURNING *', [inputs.userUUID, inputs.title, inputs.awake])
        .then((result) => {
        res.redirect('alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
    });
});
app.get('/delete-alarm', (req, res, next) => {
    let title = req.query.title;
    async_database_1.db.query('DELETE FROM alarms WHERE title = $1', [title])
        .then((result) => {
        res.redirect('alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
    });
});
app.get('/active-alarm', (req, res, next) => {
    let title = req.query.title;
    async_database_1.db.query('UPDATE alarms SET active = NOT active  WHERE title = $1', [title])
        .then((result) => {
        res.redirect('alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
    });
});
app.get('/edit-alarm-page', (req, res, next) => {
    var title = req.query.title;
    async_database_1.db.query("SELECT * FROM alarms WHERE title = $1", [title])
        .then((result) => {
        console.log(result.rows);
        res.render('edit-alarm', {
            title: result.rows[0].title,
            awake: result.rows[0].awake
        });
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
    });
});
// could do many ways, wanted to test chaining
app.get('/edit-alarm', (req, res, next) => {
    let inputs = {
        prevTitle: req.query.prevTitle,
        title: req.query.title,
        awake: req.query.awake
    };
    console.log(inputs);
    async_database_1.db.query('UPDATE alarms SET (title, awake) = ($1, $2) WHERE title = $3 RETURNING *', [inputs.title, inputs.awake, inputs.prevTitle])
        .then((result) => {
        console.log(result);
        res.redirect('alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
    });
});
module.exports = app;
//# sourceMappingURL=alarms.js.map