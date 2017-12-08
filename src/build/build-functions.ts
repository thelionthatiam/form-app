import { exec } from 'child_process'
import * as prompt from 'prompt';
import * as fs from 'fs';
prompt.start()


interface Item {
  description:string;
  message:string;
  type:string;
}

interface PromptProperty {
  properties:{
    [key: string]: Item
  }
}

interface Result {
  user:string;
  database:string;
  host:string;
  password:string;
  deleteTables:String;
  prevConn:string;
}


let tableDrop = psqlCommand(["DROP TABLE nonce", "DROP TABLE users"]);

function applyDefaults(obj:Result) {
  for(let k in obj) {
    if (k === 'database' && obj[k] === '') {
      obj.database = 'formapp';
      console.log(obj[k], "is the database")
    } else if (k === 'user' && obj[k] === '') {
      obj.user = 'formadmin';
      console.log(obj[k], "is the user")
    } else if (k === 'password' && obj[k] === '') {
      obj.password = 'formpassword'
      console.log(obj[k], "is the password")
    } else if (k === 'host' && obj[k] === '') {
      obj.host = 'localhost'
      console.log(obj[k], "is the host")
    }
  }
  return obj;
}

function psqlCommand(array:[string]) {
  const command = " --command=";
  let finarr = [];
  for (let i = 0; i < array.length; i++) {
    finarr.push(command);
    array[i] = '"' + array[i] + '"';
    finarr.push(array[i]);
  }
  return finarr.join('');
}

function connectCommand(user:string, host:string, database:string, password:string) {
  let connectCommand =
      "PGPASSWORD=" + password +
      " psql" +
      " -U " + user +
      " -h " + host +
      " -d " + database
  return connectCommand;
}

function prompter(promptObj:PromptProperty, cb:Function) {
  prompt.get(promptObj, function(err:Error, result:Result) {
    if (err) {
      console.log("something went wrong", err)
      cb(err);
    } else {
      cb(null, result);
    }
  })
}


function childProcess(string:string, cb:Function) {
  exec(string, function(error, stdout, stderr) {
    if (error) {
      cb(error)
    } else {
      cb(null, stdout, stderr);
    }
  })
}

let tablesExist = psqlCommand(["SELECT * FROM users", "SELECT * FROM nonce"]);

function fileChecker(path:string) {
  try {
    let file = require(path);
    return true;
  } catch (e) {
    return false;
  }
}

let makeJSONfromObj = function(path:string, obj:Result, cb:Function) {
  let data = JSON.stringify(obj);
  fs.writeFile(path, data, (err) => {
    if(err) {
      cb(err);
    }
  })
}
let removeConfig = function(path:string, cb:Function) {
  fs.unlink(path, (err) => {
    if (err) {
      cb(err);
    }
  });
}


export {
  applyDefaults,
  psqlCommand,
  fileChecker,
  makeJSONfromObj,
  connectCommand,
  prompter,
  childProcess,
  tablesExist,
  tableDrop,
  removeConfig
};
