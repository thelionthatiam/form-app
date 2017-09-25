const bcrypt = require('bcrypt');

function makeRandomString() {
  var string = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,.<>/?;:'{}[]|";
  for (var i = 0; i <= 40; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  var string = bcrypt.hashSync(string, 10);
  return string;
}

module.exports = {
  nonce: makeRandomString
};
