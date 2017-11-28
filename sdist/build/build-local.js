"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { exec } = require('child_process');
const prompt = require('prompt');
const fs = require('fs');
const build_assets_1 = require("./build-assets");
let restart = {
    properties: {
        redo: {
            description: "Use new credentials",
            message: "use true or false",
            type: "boolean"
        }
    }
};
let dbOnly = {
    properties: {
        newTables: {
            description: "Make new tables or delete database entirely (newTables, deleteDatabse)",
            message: "use newTables or deleteDatabase",
            type: "string"
        }
    }
};
function localBuild() {
    let adminLocal = 'psql postgres', adminConnect = 'psql postgres';
    if (build_assets_1.fileChecker('../config/connect-config')) {
        let databaseLocal = require('../config/connect-config');
        let connectLocal = 'psql -d ' + databaseLocal.dbname;
        // what do to with existing db
        prompt.get(dbOnly, function (err, result) {
            if (result.newTables) {
                exec(connectLocal + build_assets_1.tableDrop, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    else {
                        build_assets_1.tableBuild(adminLocal);
                    }
                });
            }
            else {
                let dbDrop = build_assets_1.psqlCommand(["DROP DATABASE " + databaseLocal.dbname, "DROP USER " + databaseLocal.username]);
                exec(adminLocal + dbDrop, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    else {
                        fs.unlink('./config/connect-config.json', function () { });
                        let newDBatabaseOptions = {
                            properties: {
                                user: {
                                    description: "choose a name for the database you would like to create(enter for default: formapp)",
                                    message: "Use a string",
                                    type: 'string'
                                },
                                dbname: {
                                    description: "choose a username to own the database(enter for default: formadmin)",
                                    message: "Use a string",
                                    type: 'string'
                                }
                            }
                        };
                        build_assets_1.dbAndTable(newDBatabaseOptions, adminLocal, adminConnect);
                    }
                });
            }
        });
    }
    else {
        let adminConnect = 'psql postgres';
        let sameSettings = {
            properties: {
                choice: {
                    description: "use existing database or create new (same/create)",
                    message: "Use a string (existing/cerate)",
                    required: true,
                    type: 'string'
                }
            }
        };
        prompt.start();
        prompt.get(sameSettings, function (err, result) {
            if (result.choice === "existing") {
                // use existing database and create tables
                let existingDB = {
                    properties: {
                        dbname: {
                            description: "identify database that already exists",
                            message: "use a string",
                            required: true,
                            type: "string"
                        }
                    },
                    username: {
                        description: "what is the user that owns the database (can be skipped)",
                        message: "use a string",
                        type: "string"
                    },
                    password: {
                        description: "what is the password for the database (can be skipped)",
                        message: "use a string",
                        type: "string"
                    }
                };
                prompt.start();
                prompt.get(existingDB, function (err, result) {
                    let databaseLocal = {
                        dbname: result.dbname,
                        username: result.username,
                        password: result.password
                    };
                    let connectLocal = 'psql -d ' + result.dbname;
                    exec(connectLocal + build_assets_1.tableBuild, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        else {
                            console.log(`stout:${stdout}`);
                            build_assets_1.makeJSONfromObj('./config/connect-config.json', databaseLocal);
                        }
                    });
                });
            }
            else {
                let newDBatabaseOptions = {
                    properties: {
                        dbname: {
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
                prompt.start();
                prompt.get(newDBatabaseOptions, function (err, result) {
                    let databaseLocal = {
                        dbname: result.dbname,
                        username: result.username,
                        password: result.password
                    };
                    databaseLocal = build_assets_1.applyDefaults(databaseLocal);
                    let connectLocal = 'psql -d ' + databaseLocal.dbname;
                    exec(adminConnect + build_assets_1.createUserAndDB(databaseLocal.username, databaseLocal.dbname), (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        else {
                            console.log(`stdout:${stdout}`);
                            exec(connectLocal + build_assets_1.tableBuild, (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`exec error: ${error}`);
                                    return;
                                }
                                else {
                                    console.log(`stout:${stdout}`);
                                    build_assets_1.makeJSONfromObj('./config/connect-config.json', databaseLocal);
                                }
                            });
                        }
                    });
                });
            }
        });
    }
    function credentialSet() {
        try {
            let dbOptions = require('../config/credentials.json');
            let signInNewDB = 'psql -d ' + dbOptions.dbname + " ";
            let doUsersExist = "SELECT * FROM users";
            let doNonceExist = "SELECT * FROM nonce";
            let tablesExist = build_assets_1.psqlCommand([doUsersExist, doNonceExist]);
            exec(signInNewDB + tablesExist, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                else {
                    console.log(`stdout:${stdout}`);
                    console.log('everything is working, what do you want?');
                    prompt.start();
                    prompt.get(restart, function (err, result) {
                        console.log("You said ", result.redo);
                        if (result.redo === true) {
                            fs.unlink('./config/credentials.json', function () { });
                        }
                    });
                }
            });
        }
        catch (e) {
            prompt.start();
            prompt.get(credentialOptions, function (err, result) {
                console.log("You said ", result.dbname);
                console.log("You said ", result.username);
                console.log("You said ", result.password);
                let dbOptions = {
                    dbname: result.dbname,
                    username: result.username,
                    password: result.password
                };
                dbOptions = build_assets_1.applyDefaults(dbOptions);
                // CREATE DATABASE formapp;
                // CREATE USER formadmin;
                // GRANT ALL PRIVILEGES ON DATABASE formapp TO formadmin;
                // ALTER USER formadmin WITH SUPERUSER;
                let createdb = "CREATE DATABASE " + dbOptions.dbname + ";";
                let createuser = "CREATE USER " + dbOptions.username + ";";
                let grantPriv = "GRANT ALL PRIVILEGES ON DATABASE " + dbOptions.dbname + " TO " + dbOptions.username + ";";
                let superUser = "ALTER USER " + dbOptions.username + " WITH SUPERUSER;";
                let makeUserAndDB = build_assets_1.psqlCommand([createdb, createuser, grantPriv, superUser]);
                let signIn = 'psql postgres';
                //sign in for newly created database
                let signInNewDB = 'psql -d ' + dbOptions.dbname;
                exec(signIn + makeUserAndDB, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    else {
                        console.log(`stdout:${stdout}`);
                        exec(signInNewDB + ' -a -f ./build/database-build.sql', (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                return;
                            }
                            else {
                                console.log(`stout:${stdout}`);
                                build_assets_1.makeJSONfromObj(dbOptions);
                            }
                        });
                    }
                });
            });
        }
    }
}
//# sourceMappingURL=build-local.js.map