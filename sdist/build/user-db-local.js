"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { exec } = require('child_process');
const prompt = require('prompt');
let dbOptions = {
    dbname: "unset",
    username: "unset",
    password: "unset"
};
exports.dbOptions = dbOptions;
prompt.start();
let options = {
    properties: {
        dbname: {
            description: "choose a name for the database you would like to create",
            message: "use a string",
            type: "string"
        },
        username: {
            description: "choose a username to own the database",
            message: "use a string",
            type: "string"
        },
        password: {
            description: "supply the password associated with the database",
            message: "use a string",
            type: "string"
        }
    }
};
prompt.get(options, function (err, result) {
    console.log("You said ", result.dbname);
    console.log("You said ", result.username);
    console.log("You said ", result.password);
    dbOptions.dbname = result.dbname;
    dbOptions.username = result.username;
    dbOptions.password = result.password;
    console.log(dbOptions);
});
let dbname = dbOptions.dbname;
let username = dbOptions.username;
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
//sign in for newly created database
let signInNewDB = 'psql -d ' + dbname;
exports.signInNewDB = signInNewDB;
let signIn = 'psql postgres';
exec(signIn + makeUserAndDB, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    else {
        console.log(`stdout:${stdout}`);
        exec(signInNewDB + ' -a -f ./database-build.sql', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            else {
                console.log(`stout:${stdout}`);
            }
        });
    }
});
//# sourceMappingURL=user-db-local.js.map