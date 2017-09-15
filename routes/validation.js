var exports = module.exports = {};

exports.errTranslator = function(error) {
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
    if (keyChecker.test(err)) {
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
