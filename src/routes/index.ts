import * as fs from "fs";
import * as help from '../functions/promise-helpers';
import * as helper from '../functions/helpers';
import * as bcrypt from 'bcrypt';
import { Inputs, PGOutput, ModRequest } from '../../typings/typings';
import { transporter, mailOptions } from "../config/mail-config.js";
import * as express from 'express';
import { db } from '../middleware/async-database';
const router = express.Router();

router.use('/', require('./authorization'))
router.use('/', require('./email'))
router.use('/', require('./accounts'));
router.use('/', require('./shopping'));
router.use('/accounts', require('./account'));
router.use('/accounts/:email', require('./payment'));
router.use('/accounts/:email', require('./alarms'));
router.use('/accounts/:email', require('./cart'));



router.get('/', function (req, res, next) {
  res.render('login');
})

router.get('/home', (req, res) => {
  console.log("home page", req.session)
  res.render('home', {
    title:"yo",
    email:req.session.user.email
  })
})

module.exports = router;
