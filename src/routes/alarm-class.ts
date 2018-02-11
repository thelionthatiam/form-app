import * as express from 'express';
import * as r from '../resources/value-objects';
import { dbErrTranslator, compare } from '../functions/helpers';
import { intervalTimer } from '../functions/clock';
import { db } from '../middleware/database';
const EventEmitter = require('events').EventEmitter
const router = express.Router();

const mockUser = {
  uuid:'700fb850-ac21-4418-b843-8e4a0999bdf1',
  name:'timothy',
  permission:'user',
  cart_uuid:'70cf640a-cf9d-439c-98b5-0cfd8473ba02',
  email:'g@g.gg'
}

const user = r.UserSession.fromJSON(mockUser)

class Alarm {
  user_uuid: string;
  title: string;
  active: boolean;
  alarm_uuid: string;
  state: string;
  time: string;


  constructor(
    user_uuid: string,
    title: string,
    active: boolean,
    alarm_uuid: string,
    state: string,
    time: string,
  ) {
    this.user_uuid = user_uuid;
    this.title = title;
    this.active = active;
    this.alarm_uuid = alarm_uuid;
    this.state = state;
    this.time = time;
  }

  addSnooze() {
    console.log('------YOU SNOOZED! Now you have a snooze, but dont snooze to much!------')

    let query = 'UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3'
    let input = ['snoozing', this.user_uuid, this.alarm_uuid]
    db.query(query, input)
      .then((result) => {
        return db.query('INSERT INTO snoozes(user_uuid, alarm_uuid) VALUES ($1, $2)', [this.user_uuid, this.alarm_uuid])
      })
      .catch((error) => {
        console.log(error)
      })
    }

  addDismiss() {
    console.log('------YOU SLEPT IN! Now you have a dismiss under your belt.------')

    let query = 'UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3'
    let input = ['dismissed', this.user_uuid, this.alarm_uuid]
    db.query(query, input)
      .then((result) => {
        return db.query('INSERT INTO dismisses(user_uuid, alarm_uuid) VALUES ($1, $2)', [this.user_uuid, this.alarm_uuid])
      })
      .catch((error) => {
        console.log(error)
      })
    }

  addWake() {
    console.log('------NICE JOB, YOU WOKE UP! CARPE DIEM!------')

    let query = 'UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3'
    let input = ['woke', this.user_uuid, this.alarm_uuid]
    db.query(query, input)
      .then((result) => {
        return db.query('INSERT INTO wakes(user_uuid, alarm_uuid) VALUES ($1, $2)', [this.user_uuid, this.alarm_uuid])
      })
      .catch((error) => {
        console.log(error)
      })
    }

  triggerAlarm() {
    console.log('------ALARM TRIGGERED------')

    let query = 'UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3'
    let input = ['ringing', this.user_uuid, this.alarm_uuid]

    db.query(query, input)
      .then((result) =>{
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
    }

  alarmReset() {
    let query = 'UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3'
    let input = ['pending', this.user_uuid, this.alarm_uuid]

      db.query(query, input)
      .then((result) =>{
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
    }

    snoozing() {
    let currentTime = Date.now();
    let endTime = currentTime + 10000; // ten second snooze
    this.addSnooze();

    let thing = setInterval(() => {
      let timeLeft = endTime - Date.now()
      console.log('timeleft', timeLeft)

      db.query('SELECT state FROM alarms WHERE user_uuid = $1 AND alarm_uuid = $2', [this.user_uuid, this.alarm_uuid])
        .then((result) => {
          let state = result.rows[0].state;
          console.log(state)
          if (state === 'snoozing') {
            if (timeLeft < 0 ) {
              clearInterval(thing)
              this.triggerAlarm()
              this.ringing()
            }
          } else if (state === 'dismiss') {
            clearInterval(thing)
            this.addDismiss()
          } else if (state === 'woke') {
            clearInterval(thing)
            this.addWake()
          }
        })

    }, 1000)

  }


  ringing() {
    let currentTime = Date.now()
    let endTime = currentTime + 6000;

    let thing = setInterval(() => {
      let timeLeft = endTime - Date.now()
      console.log('timeleft', timeLeft)

      db.query('SELECT state FROM alarms WHERE user_uuid = $1 AND alarm_uuid = $2', [this.user_uuid, this.alarm_uuid])
        .then((result) => {
          let state = result.rows[0].state;
          console.log(state)
          if (state === 'ringing') {
            if (timeLeft < 0 ) {
              clearInterval(thing)
              this.addDismiss()
            }
          } else if (state === 'snoozing') {
            clearInterval(thing)
            this.snoozing()
          } else if (state === 'dismiss') {
            clearInterval(thing)
            this.addDismiss()
          } else if (state === 'woke') {
            clearInterval(thing)
            this.addWake()
          }
        })

    }, 1000)

  }
}
module.exports = router;
