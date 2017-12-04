"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obj = require("./build-objects");
const func = require("./build-functions");
const build_functions_1 = require("./build-functions");
const build_strings_1 = require("./build-strings");
function build(dbConnect, result) {
    // check if tables exist
    console.log(dbConnect);
    func.childProcess(dbConnect + build_functions_1.tablesExist, function (error, stdout, stderr) {
        if (error) {
            console.error(`exec error: ${error}`);
            if (build_strings_1.noTable.test(error)) {
                console.log('No user table, creating tables');
                func.childProcess(dbConnect + build_strings_1.buildTables, function (error, stdout, stderr) {
                    if (error) {
                        console.error(`exec error: ${error}`);
                    }
                    else {
                        console.log(`stdout: ${stdout}`);
                        console.log(`stderr: ${stderr}`);
                        console.log('tables added to empty database');
                        func.makeJSONfromObj('../config/connect-config.json', result); // store that information in a JSON
                        return;
                    }
                });
            }
        }
        else {
            func.makeJSONfromObj('../config/connect-config.json', result); // store that information in a JSON
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            func.prompter(obj.deleteTables, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    if (result.deleteTables) {
                        console.log(result);
                        func.childProcess(dbConnect + build_functions_1.tableDrop, function (err, result) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(result);
                                return;
                            }
                        });
                    }
                    else {
                        console.log('tables not deleted');
                        return;
                    }
                }
            });
        }
    });
}
if (func.fileChecker('.sadfnect-config.json')) {
    // build with connect string made by passing other prompt obj through
    func.prompter(obj.prevConn, function (err, result) {
        if (err) {
            console.log(err);
        }
        else if (result.prevConn) {
            let connConfig = require('../config/connect-config.json');
            let dbConnect = func.connectCommand(connConfig.user, connConfig.host, connConfig.database, connConfig.password);
            build(dbConnect, connConfig);
        }
        else {
            func.removeConfig;
            return;
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
            build(dbConnect, result);
        }
    });
}
//# sourceMappingURL=build.js.map