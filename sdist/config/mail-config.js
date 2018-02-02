"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeMailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const nodemailer = require('nodemailer');
const handlebars = require('express-handlebars');
const path = require('path');
let viewEngine = handlebars.create({});
let options = {
    viewEngine: viewEngine,
    viewPath: path.resolve(__dirname, '../../views'),
    extName: '.hbs'
};
var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'this1234567890is1234567890test@gmail.com',
        pass: 'Mapex133'
    }
});
exports.transporter = transporter;
transporter.use('compile', hbs(options));
var mailOptions = {
    from: 'juliantheberge@gmail.com',
    to: 'juliantheberge@gmail.com',
    subject: 'testing html emails'
};
exports.mailOptions = mailOptions;
//# sourceMappingURL=mail-config.js.map