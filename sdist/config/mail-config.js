"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeMailer = require("nodemailer");
var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'this1234567890is1234567890test@gmail.com',
        pass: 'Mapex133'
    }
});
exports.transporter = transporter;
var mailOptions = {
    from: 'juliantheberge@gmail.com',
    to: null,
    subject: 'Password reset from form app',
    text: "http://localhost:3000/auth/new-password"
};
exports.mailOptions = mailOptions;
//# sourceMappingURL=mail-config.js.map