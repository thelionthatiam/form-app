import * as nodeMailer from 'nodemailer';
import * as helper from './helpers';
import { transporter, mailOptions } from "../config/mail-config.js";
import { ModResponse, ModRequest, Outputs } from '../../typings/typings';
import { Transporter, SentMessageInfo, SendMailOptions } from '../../node_modules/@types/nodemailer/index';

function logout(req:ModRequest, res:ModResponse, thisPage:string, param = "Welcome back!") {
  req.session.destroy(function(err:Error) {
    if (err) {
      helper.genError(res, thisPage, "Could not log out normally.");
    } else {
      res.render('index', {
        title:"A pleasent form app",
        subtitle:param,
      });
    }
  });
}

function sendMail(mailOptions:SendMailOptions, transporter:Transporter, cb:Function) {
  transporter.sendMail(mailOptions, function(error:Error, info:SentMessageInfo){
    if (error) {
      cb(error);
    } else {
      console.log('Email sent: ' + info.response);
      cb(null, info);
     }
  });
}

function sessionValid(token:string, outputs:Outputs, cb:Function) {
  console.log('sessionValid');
  var nonce = outputs.nonce;
  var oldDate = new Date(outputs.thetime);
  var oldTime = oldDate.getTime();
  var currentDate = new Date();
  var currentTime = currentDate.getTime();

  if (token === nonce && currentTime < oldTime + 120000) {
    cb(true);
  } else {
    cb(false);
  }
}

export {
  logout,
  sendMail,
  sessionValid
};
