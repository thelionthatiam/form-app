"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { exec } = require('child_process');
const fs = require('fs');
const prompt = require('prompt');
const buildTables = ' -a -f ./sdist/build/database-build.sql';
exports.buildTables = buildTables;
prompt.start();
function applyDefaults(obj) {
    for (let k in obj) {
        if (k === 'database' && obj[k] === '') {
            console.log(obj[k], "in database");
            obj.database = 'formapp';
        }
        else if (k === 'username' && obj[k] === '') {
            console.log(obj[k], "in username");
            obj.username = 'formadmin';
        }
        else if (k === 'password' && obj[k] === '') {
            console.log(obj[k], "in formpassword");
            obj.password = 'formpassword';
        }
    }
    return obj;
}
exports.applyDefaults = applyDefaults;
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
exports.psqlCommand = psqlCommand;
function fileChecker(path) {
    try {
        let file = require(path);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.fileChecker = fileChecker;
function makeJSONfromObj(path, obj) {
    let data = JSON.stringify(obj);
    fs.writeFileSync(path, data);
}
exports.makeJSONfromObj = makeJSONfromObj;
function remoteConnectCommand(user, host, database, password) {
    let connectCommand = "PGPASSWORD=" + password +
        " psql" +
        " -U " + user +
        " -h " + host +
        " -d " + database;
    return connectCommand;
}
exports.remoteConnectCommand = remoteConnectCommand;
function createUserAndDB(username, database) {
    let createdb = "CREATE DATABASE " + database + ";";
    let createuser = "CREATE USER " + username + ";";
    let grantPriv = "GRANT ALL PRIVILEGES ON DATABASE " + database + " TO " + username + ";";
    let superUser = "ALTER USER " + username + " WITH SUPERUSER;";
    let makeUserAndDB = psqlCommand([createdb, createuser, grantPriv, superUser]);
    return makeUserAndDB;
}
exports.createUserAndDB = createUserAndDB;
let tablesExist = psqlCommand(["SELECT * FROM users", "SELECT * FROM nonce"]);
exports.tablesExist = tablesExist;
let tableDrop = psqlCommand(["DROP TABLE nonce", "DROP TABLE users"]);
exports.tableDrop = tableDrop;
function dbAndTable(promptOpts, adminRemote, adminConnect) {
    prompt.get(promptOpts, function (err, result) {
        console.log('db', result.database);
        console.log('user', result.username);
        let databaseRemote = {
            database: result.database,
            username: result.username,
            host: adminRemote.host,
            password: adminRemote.password
        };
        databaseRemote = applyDefaults(databaseRemote);
        let databaseConnect = remoteConnectCommand(databaseRemote.username, databaseRemote.host, databaseRemote.database, databaseRemote.password);
        let makeUserAndDB = createUserAndDB(databaseRemote.username, databaseRemote.database);
        exec(adminConnect + makeUserAndDB, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            else {
                console.log(`stdout:${stdout}`);
                exec(databaseConnect + ' -a -f ./build/database-build.sql', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    else {
                        console.log(`stout:${stdout}`);
                        makeJSONfromObj('./config/connnect-config', databaseRemote); // will merge with db-config
                    }
                });
            }
        });
    });
}
exports.dbAndTable = dbAndTable;
function tableBuild(adminRemote) {
    // let databaseRemote = adminRemote;
    // let databaseConnect = remoteConnectCommand(databaseRemote.username, databaseRemote.host, databaseRemote.database, databaseRemote.password);
    exec(adminRemote + buildTables, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        else {
            console.log(`stout:${stdout}`);
            // makeJSONfromObj('./config/connnect-config', databaseRemote);
        }
    });
}
exports.tableBuild = tableBuild;
function adminDBorNewDB(adminRemote, adminConnect) {
    let sameSettings = {
        properties: {
            choice: {
                description: "use same database and user or create new (same/create)",
                message: "Use a string (same/create)",
                required: true,
                type: 'string'
            }
        }
    };
    prompt.get(sameSettings, function (err, result) {
        if (result.choice === "same") {
            let databaseRemote = adminRemote;
            let databaseConnect = remoteConnectCommand(databaseRemote.username, databaseRemote.host, databaseRemote.database, databaseRemote.password);
            console.log(databaseConnect);
            exec(databaseConnect + buildTables, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                else {
                    console.log(`stout:${stdout}`);
                    // makeJSONfromObj('./config/connnect-config', databaseRemote);
                }
            });
        }
        else if (result.choice === "create") {
            let newDBoptions = {
                properties: {
                    database: {
                        description: "choose a name for the database you would like to create(enter for default: formapp)",
                        message: "Use a string",
                        type: 'string'
                    },
                    username: {
                        description: "choose a username to own the database(enter for default: formadmin)",
                        message: "Use a string",
                        type: 'string'
                    }
                }
            };
            dbAndTable(newDBoptions, adminRemote, adminConnect);
        }
        else {
            console.log('there was an error, try again');
            return;
        }
    });
}
exports.adminDBorNewDB = adminDBorNewDB;
function localDBandTable(adminConnect) {
    let newDBoptions = {
        properties: {
            database: {
                description: "choose a name for the database you would like to create(enter for default: formapp)",
                message: "use a string",
                type: "string"
            },
            username: {
                description: "choose a username to own the database(enter for default: formadmin)",
                message: "use a string",
                type: "string"
            },
            password: {
                description: "supply the password associated with the database(enter for default: formpassword)",
                message: "use a string",
                type: "string"
            }
        }
    };
    prompt.get(newDBoptions, function (err, result) {
        let databaseLocal = {
            database: result.database,
            username: result.username,
            password: result.password
        };
        databaseLocal = applyDefaults(databaseLocal);
        let connectLocal = 'psql -d ' + databaseLocal.database;
        exec(adminConnect + createUserAndDB(databaseLocal.username, databaseLocal.database), (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            else {
                console.log(`stdout:${stdout}`);
                exec(connectLocal + buildTables, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    else {
                        console.log(`stout:${stdout}`);
                        makeJSONfromObj('./sdist/config/connect-config.json', databaseLocal);
                    }
                });
            }
        });
    });
}
exports.localDBandTable = localDBandTable;
//# sourceMappingURL=build-assets.js.map