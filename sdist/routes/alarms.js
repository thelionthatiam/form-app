"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../functions/helpers");
const express = require("express");
const async_database_1 = require("../middleware/async-database");
const router = express.Router();
router.route('/alarms')
    .post((req, res) => {
    async_database_1.db.query('INSERT INTO alarms(user_uuid, title, awake) VALUES ($1, $2, $3) RETURNING *', [req.session.user.uuid, req.body.title, req.body.awake])
        .then((result) => {
        res.redirect('alarms');
    })
        .catch((err) => {
        console.log(err);
        let userError = helpers_1.dbErrTranslator(err.message);
        res.render('new-alarm', { dbError: userError });
    });
})
    .get((req, res) => {
    console.log('GET alarms');
    async_database_1.db.query("SELECT * FROM alarms WHERE user_uuid = $1", [req.session.user.uuid])
        .then((result) => {
        let alarmContent = result.rows;
        let sortedAlarms = alarmContent.sort(helpers_1.compare);
        console.log(sortedAlarms);
        res.render('alarms', {
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
    res.render('new-alarm', {
        email: req.session.user.email
    });
});
router.route('/alarms/:title')
    .get((req, res) => {
    let title = req.query.title;
    async_database_1.db.query("SELECT * FROM alarms WHERE title = $1 AND user_uuid = $2", [title, req.session.user.uuid])
        .then((result) => {
        console.log(result.rows);
        res.render('edit-alarm', {
            title: result.rows[0].title,
            awake: result.rows[0].awake,
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
        awake: req.body.awake,
        active: req.body.active
    };
    console.log('alarms PUT happening');
    async_database_1.db.query('UPDATE alarms SET (title, awake, active) = ($1, $2, $3) WHERE title = $4 RETURNING *', [inputs.title, inputs.awake, inputs.active, inputs.prevTitle])
        .then((result) => {
        console.log(result);
        res.redirect('/accounts/' + req.session.user.email + '/alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
    });
})
    .delete((req, res) => {
    let title = req.body.title;
    console.log('delete-alarm happening');
    async_database_1.db.query('DELETE FROM alarms WHERE title = $1', [title])
        .then((result) => {
        console.log('alarm deleted');
        res.redirect('/accounts/' + req.session.user.email + '/alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
    });
});
module.exports = router;
//# sourceMappingURL=alarms.js.map