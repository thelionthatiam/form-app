"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const helpers_1 = require("../../functions/helpers");
const database_1 = require("../../middleware/database");
const router = express.Router();
let viewPrefix = 'alarms/';
router.route('/alarms')
    .post((req, res) => {
    let query = 'INSERT INTO alarms(user_uuid, title, time) VALUES ($1, $2, $3) RETURNING *';
    let input = [req.session.user.uuid, req.body.title, req.body.time];
    database_1.db.query(query, input)
        .then((result) => {
        res.redirect('alarms');
    })
        .catch((err) => {
        console.log(err);
        let userError = helpers_1.dbErrTranslator(err.message);
        res.render(viewPrefix + 'new-alarm', { dbError: userError });
    });
})
    .get((req, res) => {
    database_1.db.query("SELECT * FROM alarms WHERE user_uuid = $1", [req.session.user.uuid])
        .then((result) => {
        let alarmContent = result.rows;
        let sortedAlarms = alarmContent.sort(helpers_1.compare);
        res.render(viewPrefix + 'alarms', {
            alarmContent: sortedAlarms,
            email: req.session.user.email
        });
    })
        .catch((err) => {
        console.log(err);
        res.render('error', {
            errName: err.message,
            errMessage: null
        });
    });
});
router.get('/new-alarm', (req, res, next) => {
    res.render(viewPrefix + 'new-alarm', {
        email: req.session.user.email
    });
});
router.route('/alarms/:title')
    .get((req, res) => {
    let title = req.query.title;
    database_1.db.query("SELECT * FROM alarms WHERE title = $1 AND user_uuid = $2", [title, req.session.user.uuid])
        .then((result) => {
        res.render(viewPrefix + 'edit-alarm', {
            title: result.rows[0].title,
            time: result.rows[0].time,
            active: result.rows[0].active,
            email: req.session.user.email
        });
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('/alarms/:title', { dbError: err.stack });
    });
})
    .put((req, res) => {
    let inputs = {
        prevTitle: req.body.prevTitle,
        title: req.body.title,
        time: req.body.time,
        active: req.body.active
    };
    console.log(inputs);
    let query = 'UPDATE alarms SET (title, time, active) = ($1, $2, $3) WHERE title = $4';
    let input = [inputs.title, inputs.time, inputs.active, inputs.prevTitle];
    database_1.db.query(query, input)
        .then((result) => {
        res.redirect('/accounts/' + req.session.user.email + '/alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render(viewPrefix + 'alarms', { dbError: err.stack });
    });
})
    .delete((req, res) => {
    let title = req.body.title;
    database_1.db.query('DELETE FROM alarms WHERE title = $1', [title])
        .then((result) => {
        res.redirect('/accounts/' + req.session.user.email + '/alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render(viewPrefix + 'alarms', { dbError: err.stack });
    });
});
// alarm functionality
router.post('/alarms/:title/snooze', (req, res) => {
    let alarm = req.body.alarm_uuid;
    console.log(alarm);
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['snoozing', req.session.user.uuid, alarm])
        .then((result) => {
        console.log(result);
        res.redirect('/accounts/' + req.session.user.uuid + '/alarms');
    })
        .catch((error) => {
        console.log(error);
    });
});
router.post('/alarms/:title/dismiss', (req, res) => {
    let alarm = req.body.alarm_uuid;
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['dismissed', req.session.user.uuid, alarm])
        .then((result) => {
        console.log(result);
        res.redirect('/accounts/' + req.session.user.uuid + '/alarms');
    })
        .catch((error) => {
        console.log(error);
    });
});
router.post('/alarms/:title/wake', (req, res) => {
    let alarm = req.body.alarm_uuid;
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['woke', req.session.user.uuid, alarm])
        .then((result) => {
        console.log(result);
        res.redirect('/accounts/' + req.session.user.uuid + '/alarms');
    })
        .catch((error) => {
        console.log(error);
    });
});
module.exports = router;
//# sourceMappingURL=alarms.js.map