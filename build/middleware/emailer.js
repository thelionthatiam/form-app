"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailerExpressHandlebars = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const handlebars = require('express-handlebars');
const path = require('path');
const express = require("express");
const router = express.Router();
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'this1234567890is1234567890test@gmail.com',
        pass: 'Mapex133'
    }
});
let sut = nodemailerExpressHandlebars({
    viewEngine: handlebars.create({
        extname: 'hbs',
        defaultLayout: path.resolve(__dirname, '../../views/layouts/default.hbs'),
        partialsDir: path.resolve(__dirname, '../../views/partials'),
        layoutsDir: path.resolve(__dirname, '../../views/layouts')
    }),
    viewPath: path.resolve(__dirname, '../../views'),
    extName: '.hbs'
});
transporter.use('compile', sut);
function mailer() {
    return (req, res, next) => {
        req.transporter = transporter;
        next();
    };
}
exports.mailer = mailer;
//# sourceMappingURL=emailer.js.map