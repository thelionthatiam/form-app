"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const prompt = require("prompt");
const fs = require("fs");
let tableDrop = psqlCommand(["DROP TABLE nonce", "DROP TABLE users"]);
exports.tableDrop = tableDrop;
function applyDefaults(obj) {
    for (let k in obj) {
        if (k === 'database' && obj[k] === '') {
            obj.database = 'formapp';
            console.log(obj[k], "is the database");
        }
        else if (k === 'user' && obj[k] === '') {
            obj.user = 'formadmin';
            console.log(obj[k], "is the user");
        }
        else if (k === 'password' && obj[k] === '') {
            obj.password = 'formpassword';
            console.log(obj[k], "is the password");
        }
        else if (k === 'host' && obj[k] === '') {
            obj.host = 'localhost';
            console.log(obj[k], "is the host");
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
function connectCommand(user, host, database, password) {
    let connectCommand = "PGPASSWORD=" + password +
        " psql" +
        " -U " + user +
        " -h " + host +
        " -d " + database;
    return connectCommand;
}
exports.connectCommand = connectCommand;
function prompter(promptObj, cb) {
    prompt.start();
    prompt.get(promptObj, function (err, result) {
        if (err) {
            console.log("something went wrong", err);
            cb(err);
        }
        else {
            cb(null, result);
        }
    });
}
exports.prompter = prompter;
function childProcess(string, cb) {
    child_process_1.exec(string, function (error, stdout, stderr) {
        if (error) {
            cb(error);
        }
        else {
            cb(null, stdout, stderr);
        }
    });
}
exports.childProcess = childProcess;
let tablesExist = psqlCommand(["SELECT * FROM users", "SELECT * FROM nonce"]);
exports.tablesExist = tablesExist;
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
function filesInDir(dir, cb) {
    fs.readdir(dir, function (err, files) {
        if (err) {
            cb(err);
        }
        else {
            cb(null, files);
        }
    });
}
exports.filesInDir = filesInDir;
function stringOfFiles(dir, array, version, rev) {
    let finalArr = [];
    if (rev) {
        for (let i = array.length - 1; i >= version; i--) {
            finalArr.push("-f " + dir + '/' + array[i]);
        }
        return " -a " + finalArr.join(' ');
    }
    else {
        for (let i = 0; i < version; i++) {
            finalArr.push("-f " + dir + '/' + array[i]);
        }
        return " -a " + finalArr.join(' ');
    }
}
exports.stringOfFiles = stringOfFiles;
let makeJSONfromObj = function (path, obj, cb) {
    let data = JSON.stringify(obj);
    fs.writeFile(path, data, (err) => {
        if (err) {
            cb(err);
        }
    });
};
exports.makeJSONfromObj = makeJSONfromObj;
let removeConfig = function (path, cb) {
    fs.unlink(path, (err) => {
        if (err) {
            cb(err);
        }
    });
};
exports.removeConfig = removeConfig;
//# sourceMappingURL=build-functions.js.map