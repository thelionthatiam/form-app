"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obj = require("./build-objects");
const func = require("./build-functions");
const build_strings_1 = require("./build-strings");
let thing = " --command='\\dt'";
function build(dbConnect, result, cb) {
    let jsonConfig = result;
    func.childProcess(dbConnect + thing, function (err, stdout, stderr) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(`stdout: ${stdout}`);
            if (build_strings_1.noTable.test(stdout)) {
                func.prompter(obj.whatVersion, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        func.filesInDir('./database-builds/up', function (err, files) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                let fileString = func.stringOfFiles('./database-builds/up', files, result.version, false);
                                console.log(result.version);
                                console.log(fileString);
                                func.childProcess(dbConnect + fileString, function (err, stdout, stderr) {
                                    if (err) {
                                        console.error(`exec error: ${err}`);
                                        cb(err);
                                    }
                                    else {
                                        console.log(`stdout: ${stdout}`);
                                        console.log(`stderr: ${stderr}`);
                                        console.log('tables added to empty database');
                                        func.makeJSONfromObj('./sdist/config/connect-config.json', jsonConfig, function (err) {
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
                        });
                    }
                });
            }
            else {
                console.log('this is where I should be');
                // func.makeJSONfromObj('./sdist/config/connect-config.json', jsonConfig, function(err:Error, result:Result) { // store that information in a JSON
                //   if (err) {
                //     console.log(err);
                //     cb(err);
                // } else {
                console.log('successfuly made config JSON');
                func.prompter(obj.deleteTables, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        func.filesInDir('./database-builds/down', function (err, files) {
                            if (err) {
                                console.log(err);
                                cb(err);
                            }
                            else {
                                let fileString = func.stringOfFiles('./database-builds/down', files, result.versionDown, true);
                                console.log(fileString);
                                func.childProcess(dbConnect + fileString, function (err, stdout, stderr) {
                                    if (err) {
                                        console.error(`exec error: ${err}`);
                                        cb(err);
                                    }
                                    else {
                                        console.log(`stdout: ${stdout}`);
                                        console.log(`stderr: ${stderr}`);
                                        cb();
                                    }
                                });
                            }
                        });
                    }
                });
            }
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