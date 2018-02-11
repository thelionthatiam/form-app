"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const r = require("../resources/value-objects");
const helpers_1 = require("../functions/helpers");
const database_1 = require("../middleware/database");
const EventEmitter = require('events').EventEmitter;
const router = express.Router();
const mockUser = {
    uuid: '700fb850-ac21-4418-b843-8e4a0999bdf1',
    name: 'timothy',
    permission: 'user',
    cart_uuid: '70cf640a-cf9d-439c-98b5-0cfd8473ba02',
    email: 'g@g.gg'
};
const user = r.UserSession.fromJSON(mockUser);
function addLeadingZeros(number) {
    if (number < 10) {
        return '0' + number.toString();
    }
    return number;
}
function theTime() {
    let clock = new Date();
    let h = addLeadingZeros(clock.getHours());
    let m = addLeadingZeros(clock.getMinutes());
    let s = addLeadingZeros(clock.getSeconds());
    return h + ':' + m + ':' + s;
}
const eventEmitter = new EventEmitter();
eventEmitter.on('ring', () => {
    console.log('ringing event');
});
eventEmitter.on('ringingCountdown', () => {
    console.log('ringing countdown');
});
function triggerAlarm(alarm) {
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['ringing', user.uuid, alarm])
        .then((result) => {
        console.log(result);
    })
        .catch((error) => {
        console.log(error);
    });
}
function addSnooze(alarm) {
    console.log('------YOU SNOOZED! Now you have a snooze, but dont snooze to much!------');
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['snoozing', user.uuid, alarm])
        .then((result) => {
        return database_1.db.query('INSERT INTO snoozes(user_uuid, alarm_uuid) VALUES ($1, $2)', [user.uuid, alarm]);
    })
        .catch((error) => {
        console.log(error);
    });
}
function addDismiss(alarm) {
    console.log('------YOU SLEPT IN! Now you have a dismiss under your belt.------');
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['dismissed', user.uuid, alarm])
        .then((result) => {
        return database_1.db.query('INSERT INTO dismisses(user_uuid, alarm_uuid) VALUES ($1, $2)', [user.uuid, alarm]);
    })
        .catch((error) => {
        console.log(error);
    });
}
function addWake(alarm) {
    console.log('------NICE JOB, YOU WORK UP! CARPE DIEM!------');
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['woke', user.uuid, alarm])
        .then((result) => {
        return database_1.db.query('INSERT INTO wakes(user_uuid, alarm_uuid) VALUES ($1, $2)', [user.uuid, alarm]);
    })
        .catch((error) => {
        console.log(error);
    });
}
function alarmReset(alarm) {
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['pending', user.uuid, alarm])
        .then((result) => {
        console.log(result);
    })
        .catch((error) => {
        console.log(error);
    });
}
function snoozing(alarm) {
    let currentTime = Date.now();
    let endTime = currentTime + 10000; // ten second snooze
    addSnooze(alarm);
    let thing = setInterval(() => {
        let timeLeft = endTime - Date.now();
        console.log('timeleft', timeLeft);
        database_1.db.query('SELECT state FROM alarms WHERE user_uuid = $1 AND alarm_uuid = $2', [user.uuid, alarm])
            .then((result) => {
            let state = result.rows[0].state;
            console.log(state);
            if (state === 'snoozing') {
                if (timeLeft < 0) {
                    clearInterval(thing);
                    triggerAlarm(alarm);
                    ringing(alarm);
                }
            }
            else if (state === 'dismiss') {
                clearInterval(thing);
                addDismiss(alarm);
            }
            else if (state === 'woke') {
                clearInterval(thing);
                addWake(alarm);
            }
        });
    }, 1000);
}
function ringing(alarm) {
    let currentTime = Date.now();
    let endTime = currentTime + 6000;
    let thing = setInterval(() => {
        let timeLeft = endTime - Date.now();
        console.log('timeleft', timeLeft);
        database_1.db.query('SELECT state FROM alarms WHERE user_uuid = $1 AND alarm_uuid = $2', [user.uuid, alarm])
            .then((result) => {
            let state = result.rows[0].state;
            console.log(state);
            if (state === 'ringing') {
                if (timeLeft < 0) {
                    clearInterval(thing);
                    addDismiss(alarm);
                }
            }
            else if (state === 'snoozing') {
                clearInterval(thing);
                snoozing(alarm);
            }
            else if (state === 'dismiss') {
                clearInterval(thing);
                addDismiss(alarm);
            }
            else if (state === 'woke') {
                clearInterval(thing);
                addWake(alarm);
            }
        });
    }, 1000);
}
function watchUserAlarms() {
    database_1.db.query('SELECT * FROM alarms WHERE user_uuid = $1 AND active = $2', [user.uuid, true]) // and active = true
        .then((result) => {
        let alarms = result.rows;
        for (let i = 0; i < alarms.length; i++) {
            let time = alarms[i].time;
            let alarm = alarms[i].alarm_uuid;
            let state = alarms[i].state;
            if (time === theTime()) {
                if (state === 'pending') {
                    console.log('-----STARTS RINGING!!!------');
                    eventEmitter.emit('ring', triggerAlarm(alarm));
                    eventEmitter.emit('ringingCountdown', ringing(alarm));
                }
                else if (state === 'ringing') {
                    console.log('-----RINGING!!!------');
                }
                else if (state === 'snoozing') {
                    console.log('-----SNOOZING------');
                }
                else if (state === 'dismissed') {
                    console.log('-----DISMISSED------');
                }
                else if (state === 'woke') {
                    console.log('-----WAITING TO RESET------');
                }
            }
            else {
                if (state === 'woke') {
                    console.log('-----WOKE AND RESET------');
                    eventEmitter.emit('alarmReset', alarmReset(alarm));
                }
                else if (state === 'dismissed') {
                    console.log('-----DISMISSED AND RESET------');
                    eventEmitter.emit('alarmReset', alarmReset(alarm));
                }
                else if (state === 'snoozing') {
                    console.log('-----SNOOZING------');
                }
                else if (state === 'ringing') {
                    console.log('-----RINGING!!!------');
                }
            }
            console.log('ALARM: ', time, 'CURRENT TIME: ', theTime());
        }
    })
        .catch((error) => {
        console.log(error);
    });
}
function watchAlarms() {
    setInterval(() => { watchUserAlarms(); }, 1000);
}
watchAlarms();
router.get('/', (req, res) => {
    req.aQuery.selectAlarms([user.uuid])
        .then((result) => {
        let alarmContent = result.rows;
        let sortedAlarms = alarmContent.sort(helpers_1.compare);
        res.render('test', {
            alarmContent: sortedAlarms,
            email: user.email
        });
    })
        .catch((error) => {
        console.log(error);
        res.render('test');
    });
});
router.post('/snooze', (req, res) => {
    let alarm = req.body.alarm_uuid;
    console.log(alarm);
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['snoozing', user.uuid, alarm])
        .then((result) => {
        console.log(result);
        res.redirect('/');
    })
        .catch((error) => {
        console.log(error);
    });
});
router.post('/dismiss', (req, res) => {
    let alarm = req.body.alarm_uuid;
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['dismissed', user.uuid, alarm])
        .then((result) => {
        console.log(result);
        res.redirect('/');
    })
        .catch((error) => {
        console.log(error);
    });
});
router.post('/wake', (req, res) => {
    let alarm = req.body.alarm_uuid;
    database_1.db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['woke', user.uuid, alarm])
        .then((result) => {
        console.log(result);
        res.redirect('/');
    })
        .catch((error) => {
        console.log(error);
    });
});
module.exports = router;
//# sourceMappingURL=mock-alarm.js.map