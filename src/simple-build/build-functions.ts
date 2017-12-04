import { exec } from 'child_process'
import * as prompt from 'prompt';
import * as fs from 'fs';
prompt.start()

let tableDrop = psqlCommand(["DROP TABLE nonce", "DROP TABLE users"]);

function applyDefaults(obj:any) {
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

function psqlCommand(array:any) {
  const command = " --command=";
  let finarr = [];
  for (let i = 0; i < array.length; i++) {
    finarr.push(command);
    array[i] = '"' + array[i] + '"';
    finarr.push(array[i]);
  }
  return finarr.join('');
}

function fileChecker(path:string) {
  try {
    let file = require(path);
    return true;
  } catch (e) {
    return false;
  }
}

function makeJSONfromObj(path:string, obj:any) {
  let data = JSON.stringify(obj);
  fs.writeFileSync(path, data)
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

function prompter(promptObj, cb) {
  prompt.get(promptObj, function(err:any, result:any) {

    if (err) {
      console.log("something went wrong", err)
      cb(err);
    } else {
      console.log('prompter completed')
      cb(null, result);
    }
  })
}


function childProcess(string, cb) {
  console.log('step one');
  exec(string, function(error:any, stdout:any, stderr:any) {
    console.log('step two');
    if (error) {
      cb(error)
    } else {
      console.log('step three');
      cb(null, stdout, stderr);
    }

  })
}

let tablesExist = psqlCommand(["SELECT * FROM users", "SELECT * FROM nonce"]);
let removeConfig = fs.unlink('../config/connect-config.json', function(){})

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
