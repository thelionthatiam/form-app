"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ES6?
const { exec } = require('child_process');
const dbConfig = require('./sdist/config/combiner');
const prompt = require('prompt');
var argv = require('yargs')
    .option('run', {
    alias: 'h',
})
    .usage('-host [local/remote]')
    .demandOption(['host'])
    .argv;
function connectCommand(user, host, dbname, password) {
    let connectCommand = "PGPASSWORD=" + password +
        " psql" +
        " -U " + user +
        " -h " + host +
        " -d " + dbname;
    return connectCommand;
}
function connectClient(u, h, d, p) {
    if (typeof u !== "undefined" && typeof h !== "undefined" && typeof c !== "undefined" && typeof p !== "undefined") {
        return connectCommand(u, h, d, p);
    }
    else {
        let user = dbConfig.dbConfig.user;
        let host = dbConfig.dbConfig.host;
        let dbname = dbConfig.dbConfig.dbname;
        let password = dbConfig.dbConfig.password;
        return connectCommand(user, host, dbname);
    }
}
let connector = connectClient();
const userCreator = ' -a -f ./database-user.sql';
const tableCreator = ' -a -f ./database-build.sql';
if (argv.host === 'remote') {
    console.log("current database settings:\n", dbConfig);
    let fromConfig = {
        properties: {
            choice: {
                description: "Would you like to use the username, host, and dbname you supplied in db-custom.json to connect? Otherwise you will be able to input here",
                message: "Use true for config file, and false to input",
                required: true,
                type: 'boolean'
            }
        }
    };
    prompt.start();
    prompt.get(fromConfig, function (err, result) {
        console.log('You said: ' + result.choice);
        if (result.choice === true) {
            exec(connector + userCreator, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                else {
                    console.log(`stdout:${stdout}`);
                    exec(connector + tableCreator, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        else {
                            console.log(`stdout:${stdout}`);
                            exec('npm install', (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`exec error: ${error}`);
                                    return;
                                }
                                else {
                                    console.log(`stdout:${stdout}`);
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            let userDefined = {
                properties: {
                    user: {
                        description: "Postgres user you would like to use",
                        message: "Use a string",
                        required: true,
                        type: 'string'
                    },
                    host: {
                        description: "Host you would like to use",
                        message: "Use a string",
                        required: true,
                        type: 'string'
                    },
                    dbname: {
                        description: "Name of the database",
                        message: "Use a string",
                        required: true,
                        type: 'string'
                    }
                }
            };
            prompt.start();
            prompt.get(userDefined, function (err, result) {
                connector = connectClient(result.user, result.host, result.dbname);
                exec(connector + userCreator, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    else {
                        console.log(`stdout:${stdout}`);
                        exec(connector + tableCreator, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                return;
                            }
                            else {
                                console.log(`stdout:${stdout}`);
                                exec('npm install', (error, stdout, stderr) => {
                                    if (error) {
                                        console.error(`exec error: ${error}`);
                                        return;
                                    }
                                    else {
                                        console.log(`stdout:${stdout}`);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    });
}
else if (argv.host === 'local') {
    try {
        let dbCustom = require('./sdist/config/db-custom.json');
        console.log('It seems you have a custom file, but do not wish to use it. Please remove it from the config folder. Otherwise use select custom=y');
    }
    catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            console.log('using default database settings');
            exec('psql postgres -a -f ./database-user.sql', (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                else {
                    console.log(`stdout:${stdout}`);
                    exec('psql -d formapp -U formadmin -a -f ./database-build.sql', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        else {
                            console.log(`stdout:${stdout}`);
                            exec('npm install', (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`exec error: ${error}`);
                                    return;
                                }
                                else {
                                    console.log(`stdout:${stdout}`);
                                    console.log(`app started`);
                                    exec('node ./sdist/app.js', (error, stdout, stderr) => {
                                        if (error) {
                                            console.error(`exec error: ${error}`);
                                            return;
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            console.log('there was a problem, contact the developer');
        }
    }
}
//# sourceMappingURL=build.js.map