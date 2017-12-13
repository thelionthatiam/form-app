"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const router = express.Router();
const async_database_1 = require("../middleware/async-database");
router.route('/alarms')
    .post((req, res) => {
    let inputs = {
        userUUID: req.user.userID,
        title: req.body.title,
        awake: req.body.awake
    };
    console.log('alarms post happening');
    console.log([inputs.userUUID, inputs.title, inputs.awake]);
    async_database_1.db.query('INSERT INTO alarms(user_uuid, title, awake) VALUES ($1, $2, $3) RETURNING *', [inputs.userUUID, inputs.title, inputs.awake])
        .then((result) => {
        res.redirect('alarms');
    })
        .catch((err) => {
        console.log(err);
        res.render('alarms', { dbError: err.stack });
    });
})
    .get((req, res) => {
    let userUUID = [req.user.userID];
    console.log('alarms get happening');
    async_database_1.db.query("SELECT * FROM alarms WHERE user_uuid = $1", userUUID)
        .then((result) => {
        let alarmContent = result.rows;
        res.render('alarms', { alarmContent: alarmContent });
    })
        .catch((err) => {
        console.log(err);
        res.render('error', {
            errName: err.message,
            errMessage: null
        });
    });
});
router.get('/add-alarm', (req, res, next) => {
    let thisPage = 'index';
    let nextPage = 'add-alarm';
    res.render(nextPage);
});
// router.post('/active-alarm', (req, res, next) => {
//   let title = req.body.title
//   db.query('UPDATE alarms SET active = NOT active  WHERE title = $1', [title])
//     .then((result) => {
//       res.redirect('alarms');
//     })
//     .catch((err) => {
//       console.log(err.stack);
//       res.render('alarms', { dbError: err.stack });
//     });
// })
router.route('/alarms/:title')
    .get((req, res) => {
    var title = req.query.title;
    async_database_1.db.query("SELECT * FROM alarms WHERE title = $1", [title])
        .then((result) => {
        console.log(result.rows);
        res.render('edit-alarm', {
            title: result.rows[0].title,
            awake: result.rows[0].awake,
            active: function () {
                if (result.rows[0].active === "t") {
                    return "on";
                }
                else {
                    return "false";
                }
            }
        });
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
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
    console.log(inputs);
    async_database_1.db.query('UPDATE alarms SET (title, awake, active) = ($1, $2, $3) WHERE title = $4 RETURNING *', [inputs.title, inputs.awake, inputs.active, inputs.prevTitle])
        .then((result) => {
        console.log(result);
        res.redirect('/in-session/alarms');
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
        res.redirect('/in-session/alarms');
    })
        .catch((err) => {
        console.log(err.stack);
        res.render('alarms', { dbError: err.stack });
    });
});
module.exports = router;
//# sourceMappingURL=alarms.js.map