"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obj = require("./build-objects");
const func = require("./build-functions");
const build_functions_1 = require("./build-functions");
const build_strings_1 = require("./build-strings");
function build(dbConnect, result, cb) {
    // check if tables exist
    func.childProcess(dbConnect + build_functions_1.tablesExist, function (err, stdout, stderr) {
        if (err) {
            console.log('tables do not exist');
            console.error(`exec error: ${err}`);
            if (build_strings_1.noTable.test(JSON.stringify(err))) {
                console.log('No user table, creating tables');
                func.childProcess(dbConnect + build_strings_1.buildTables, function (err, stdout, stderr) {
                    if (err) {
                        console.error(`exec error: ${err}`);
                        cb(err);
                    }
                    else {
                        console.log(`stdout: ${stdout}`);
                        console.log(`stderr: ${stderr}`);
                        console.log('tables added to empty database');
                        func.makeJSONfromObj('./sdist/config/connect-config.json', result, function (err) {
                            if (err) {
                                console.log(err);
                                cb(err);
                            }
                            else {
                                console.log('successfuly made config JSON');
                                cb();
                            }
                        });
                    }
                });
            }
        }
        else {
            console.log('tables exist');
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            func.makeJSONfromObj('./sdist/config/connect-config.json', result, function (err) {
                if (err) {
                    console.log(err);
                    cb(err);
                }
                else {
                    console.log('successfuly made config JSON');
                    func.prompter(obj.deleteTables, function (err, result) {
                        if (err) {
                            console.log(err);
                            cb(err);
                        }
                        else {
                            if (result.deleteTables) {
                                console.log(result);
                                func.childProcess(dbConnect + build_functions_1.tableDrop, function (err, stdout, stderr) {
                                    if (err) {
                                        console.log(err);
                                        cb(err);
                                    }
                                    else {
                                        console.log(result);
                                        cb();
                                    }
                                });
                            }
                            else {
                                console.log('tables not deleted');
                                cb();
                            }
                        }
                    });
                }
            });
        }
    });
}
if (func.fileChecker('../config/connect-config.json')) {
    // build with connect string made by passing other prompt obj through
    func.prompter(obj.prevConn, function (err, result) {
        if (err) {
            console.log(err);
        }
        else if (result.prevConn) {
            let connConfig = require('../config/connect-config.json');
            let dbConnect = func.connectCommand(connConfig.user, connConfig.host, connConfig.database, connConfig.password);
            build(dbConnect, connConfig, function (err) {
                if (err) {
                    console.log('something went wrong with the build script. This is likely a bug, try again/contact developer here is the error: ' + err);
                }
                else {
                    console.log('build script complete');
                }
            });
        }
        else {
            func.removeConfig('./sdist/config/connect-config.json', function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('successfully deleted');
                }
            });
        }
    });
}
else {
    // build to connect prompt string // make sign in object
    func.prompter(obj.connectPrompt, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            result = func.applyDefaults(result);
            let dbConnect = func.connectCommand(result.user, result.host, result.database, result.password);
            build(dbConnect, result, function (err) {
                if (err) {
                    console.log('something went wrong with the build script. This is likely a bug, try again/contact developer here is the error: ' + err);
                }
                else {
                    console.log('build script complete');
                }
            });
        }
    });
}
//# sourceMappingURL=build.js.map