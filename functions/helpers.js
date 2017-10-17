const bcrypt = require('bcrypt');
const query = require('./queries');

//
// expand to include bcrypt?
function dbErrTranslator (error) {
  var emailChecker = /(email)/g;
  var phoneChecker = /(phone)/g;
  var keyChecker = /(key)/g;
  var checkChecker = /(check)/g;
  var passChecker = /(password)/g;
  var lengthChecker = /(value too long)/g;

  if (emailChecker.test(error)) {
    if (keyChecker.test(error)) {
      return "The email you put in has already been used. Try again.";
    } else {
      return "You did not submit a valid email. Try again.";
    }
  } else if (phoneChecker.test(error)) {
    if (keyChecker.test(error)) {
      return "The phone number you put in has already been used. Try again.";
    } else {
      return "You did not submit a valid phone number. Try again.";
    }
  } else if (passChecker.test(error)) {
    return "There was an error with your password. Contact the administrator.";

  } else if (lengthChecker.test(error)) {
    return "You typed in something over 100 characters. Keep things a shorter and try again.";
  } else {
    console.log(error);
    return "There was an error. Try again.";
  }
}

function hash(string, cb) {
  bcrypt.hash(string, 10, function(err, hash) {
    if (err) {
      cb(err);
    } else {
      cb(null, hash);
    }
  });
}

function passChecker(string) {
  var passCheck = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
  if (passCheck.test(string) === true) {
    return true;
  } else {
    return false;
  }
}

function passHash(string, cb) {
  var err = "";
  if (passChecker(string)){
    return hash(string, cb);
  } else {
    err = "Password must be at least 8 characters, contain two uppercase letters, three lower case letters, one of these '!@#$&*', and two digits. Try again.";
    cb(err);
  }
}


function hashCheck (string, hash, cb) {
  bcrypt.compare(string, hash, function(err, result) {
    if (err) {
      cb(err);
    } else {
      cb(null, result);
    }
  });
}

function makeHashedString(cb) {
  console.log('makeHashedString');
  var string = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,.<>/?;:'{}[]|";
  for (var i = 0; i <= 40; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  hash(string, cb);
}

function dbError(res, thisPage, err) {
  res.render(thisPage, { dbError: dbErrTranslator(err)} );
}

function genError(res, thisPage, param) {
  res.render(thisPage, { dbError: param } );
}


module.exports = {
  dbErrTranslator:dbErrTranslator,
  hash:hash,
  passChecker:passChecker,
  passHash:passHash,
  makeHashedString:makeHashedString,
  hashCheck:hashCheck,
  dbError:dbError,
  genError:genError,
};
