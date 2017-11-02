const nodeMailer = require('nodemailer');
// import * as nodemailer from 'nodemailer';

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'this1234567890is1234567890test@gmail.com',
    pass: 'Mapex133'
  }
});

var mailOptions = {
  from: 'juliantheberge@gmail.com',
  to: null,
  subject: 'Password reset from form app',
  text: "http://localhost:3000/auth/new-password"
};
// export {
//   transporter,
//   mailOptions
// }

module.export = {
  transporter:transporter,
  mailOptions:mailOptions
}
