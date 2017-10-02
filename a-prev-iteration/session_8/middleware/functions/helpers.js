const bcrypt = require('bcrypt');
const query = require('./queries')
const nodeMailer = require('nodemailer');

function errTranslator (error) {
  var emailChecker = /(email)/g
  var phoneChecker = /(phone)/g
  var keyChecker = /(key)/g
  var checkChecker = /(check)/g
  var passChecker = /(password)/g

  if (emailChecker.test(error)) {
    if (keyChecker.test(error)) {
      return "The email you put in has already been used. Try again."
    } else {
      return "You did not submit a valid email. Try again."
    }
  } else if (phoneChecker.test(error)) {
    if (keyChecker.test(error)) {
      return "The phone number you put in has already been used. Try again."
    } else {
      return "You did not submit a valid phone number. Try again."
    }
  } else if (passChecker.test(error)) {
    return "There was an error with your password. Contact the administrator ;)"

  } else {
    console.log(error);
    return "There was an error. Try again.";
  }
}

function hash(string) {
  return bcrypt.hashSync(string, 10);
}

function makeHashedString() {
  console.log('makeHashedString')
  var string = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,.<>/?;:'{}[]|";
  for (var i = 0; i <= 40; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  var string = bcrypt.hashSync(string, 10);
  return string;
}

function checkHashedString(res, next, input, compare) {
  console.log('checkHashedString')
    if (bcrypt.compareSync(input, compare)) {
      next();
    } else {
      res.render(thisPage, {dbError:'Password is incorrect.'})
    }
}

function doesRowExist() {
  console.log('doesRowExist')
  return function(req, res, next){
    if (res.locals === 'does not exist') {
      res.render(thisPage, {dbError:'Email not found.'} )
    } else {
      next();
    }
  }
}


function dbError() {
  console.log('dbError')
  return function(req, res, next) {
    if (res.locals.err !== undefined) {
      err = res.locals.err;
      var error = errTranslator(err.constraint);
      res.render(thisPage, {dbError: error})
    } else {
      next();
    }
  }
}

function endSession() {
  console.log('endSession')
  return function(req, res, next) {
    req.session.destroy(function(err) {
      if (err) {
        res.locals.err = err;
        console.log(err)
        next();
      } else {
        next();
      }
    })
  }
}

function sendMail(mailOptions, transporter) {
  return function (req, res, next) {
    console.log('start', mailOptions, transporter)
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('mail error', error);
        res.locals.err = error;
        next();
      } else {
        console.log('end', info)
        console.log('Email sent: ' + info.response);
        next();
       }
    });
  }
}

function isSessionTokenValid() {
  console.log('isSessionTokenValid')
  return function (req, res, next) {
    var nonce = res.locals.row.nonce
    var oldDate = new Date(res.locals.row.thetime);
    var oldTime = oldDate.getTime();
    var currentDate = new Date();
    var currentTime = currentDate.getTime();
    console.log(req.session.token, nonce, oldTime, currentTime)

    if (req.session.token === nonce && currentTime < oldTime + 120000) {
      res.locals.valid = true;
      console.log(res.locals.valid)
      next();
    } else {
      res.locals.valid = false;
      console.log(res.locals.valid)
      next();
    }
  }
}


module.exports = {
  errTranslator:errTranslator,
  hash:hash,
  makeHashedString:makeHashedString,
  checkHashedString:checkHashedString,
  doesRowExist:doesRowExist,
  dbError:dbError,
  endSession:endSession,
  sendMail:sendMail,
  isSessionTokenValid:isSessionTokenValid,
};
