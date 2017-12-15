"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
// expand to include bcrypt?
function dbErrTranslator(error) {
    let emailChecker = /(email)/g, phoneChecker = /(phone)/g, keyChecker = /(key)/g, checkChecker = /(check)/g, passChecker = /(password)/g, lengthChecker = /(value too long)/g, alarms = /(alarms)/g, awake = /(awake)/g, title = /(title)/g;
    if (emailChecker.test(error)) {
        if (keyChecker.test(error)) {
            return "The email you put in has already been used. Try again.";
        }
        else {
            return "You did not submit a valid email. Try again.";
        }
    }
    else if (phoneChecker.test(error)) {
        if (keyChecker.test(error)) {
            return "The phone number you put in has already been used. Try again.";
        }
        else {
            return "You did not submit a valid phone number. Try again.";
        }
    }
    else if (passChecker.test(error)) {
        return "There was an error with your password. Contact the administrator.";
    }
    else if (lengthChecker.test(error)) {
        return "You typed in something over 100 characters. Keep things a shorter and try again.";
    }
    else if (alarms.test(error)) {
        if (awake.test(error)) {
            return "You need to use military time. If the it is before 10:00, use leading zeros like this 06:00.";
        }
        else if (title.test(error)) {
            return "Keep your title withing 15 characters. Other than that, you should be able to do whatever you want.";
        }
    }
    else {
        console.log("ERROR", error);
        return "There was an error. Try again.";
    }
}
exports.dbErrTranslator = dbErrTranslator;
function hash(string, cb) {
    bcrypt.hash(string, 10, function (err, hash) {
        if (err) {
            cb(err);
        }
        else {
            cb(null, hash);
        }
    });
}
exports.hash = hash;
function passChecker(string) {
    let passCheck = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;
    if (passCheck.test(string) === true) {
        return true;
    }
    else {
        return false;
    }
}
exports.passChecker = passChecker;
function passHash(string, cb) {
    let err = "";
    if (passChecker(string)) {
        return hash(string, cb);
    }
    else {
        err = "Password must be at least 8 characters, contain two uppercase letters, three lower case letters, one of these '!@#$&*', and two digits. Try again.";
        cb(err);
    }
}
exports.passHash = passHash;
function hashCheck(string, hash, cb) {
    bcrypt.compare(string, hash, function (err, result) {
        if (err) {
            cb(err);
        }
        else {
            cb(null, result);
        }
    });
}
exports.hashCheck = hashCheck;
function makeHashedString(cb) {
    console.log('makeHashedString');
    let string = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,.<>/?;:'{}[]|";
    for (let i = 0; i <= 40; i++) {
        string += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    hash(string, cb);
}
exports.makeHashedString = makeHashedString;
function dbError(res, thisPage, err) {
    res.render(thisPage, { dbError: dbErrTranslator(err) });
}
exports.dbError = dbError;
function genError(res, thisPage, param) {
    res.render(thisPage, { dbError: param });
}
exports.genError = genError;
function compare(a, b) {
    const awakeA = parseInt(a.awake);
    const awakeB = parseInt(b.awake);
    let comp = 0;
    if (awakeA > awakeB) {
        comp = 1;
    }
    else if (awakeB > awakeA) {
        comp = -1;
    }
    return comp;
}
exports.compare = compare;
//# sourceMappingURL=helpers.js.map