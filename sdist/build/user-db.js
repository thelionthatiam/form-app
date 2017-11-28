"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let dbname = "whocares";
let username = "whatsthepoint";
// organize for psql command
function psqlCommand(array) {
    const command = " --command=";
    let finarr = [];
    for (let i = 0; i < array.length; i++) {
        finarr.push(command);
        array[i] = '"' + array[i] + '"';
        finarr.push(array[i]);
    }
    return finarr.join('');
}
// CREATE DATABASE formapp;
// CREATE USER formadmin;
// GRANT ALL PRIVILEGES ON DATABASE formapp TO formadmin;
// ALTER USER formadmin WITH SUPERUSER;
let createdb = "CREATE DATABASE " + dbname + ";";
let createuser = "CREATE USER " + username + ";";
let grantPriv = "GRANT ALL PRIVILEGES ON DATABASE " + dbname + " TO " + username + ";";
let superUser = "ALTER USER " + username + " WITH SUPERUSER;";
let makeUserAndDB = psqlCommand([createdb, createuser, grantPriv, superUser]);
exports.makeUserAndDB = makeUserAndDB;
console.log(makeUserAndDB);
//# sourceMappingURL=user-db.js.map