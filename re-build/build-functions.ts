const { exec } = require('child_process');
import * as prompt from 'prompt';
const fs = require('fs');
prompt.start()


function applyDefaults(obj:any) {
  for(let k in obj) {
    if (k === 'database' && obj[k] === '') {
      console.log(obj[k], "in database")
      obj.database = 'formapp';
    } else if (k === 'username' && obj[k] === '') {
      console.log(obj[k], "in username")
      obj.username = 'formadmin';
    } else if (k === 'password' && obj[k] === '') {
      console.log(obj[k], "in formpassword")
      obj.password = 'formpassword'
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

function remoteConnectCommand(user:string, host:string, database:string, password:string) {
  let connectCommand =
      "PGPASSWORD=" + password +
      " psql" +
      " -U " + user +
      " -h " + host +
      " -d " + database
  return connectCommand;
}

function createUserAndDB(username:String, database:String) {
  let createdb:string = "CREATE DATABASE " + database + ";";
  let createuser:string = "CREATE USER " + username + ";";
  let grantPriv:string = "GRANT ALL PRIVILEGES ON DATABASE " + database + " TO " + username + ";";
  let superUser:string = "ALTER USER " + username + " WITH SUPERUSER;";
  let makeUserAndDB = psqlCommand([createdb, createuser, grantPriv, superUser]);

  return makeUserAndDB;
}


function binaryPrompter(promptObj, cb) {
  prompt.get(promptObj, function(err:any, result:any) {
    if (result.pos) {
      cb();
    } else if (result.neg) {
      cb();
    } else {
      cb();
    }
  })
}

function resultToObject(resultObj, outputObj) {
  for (let k in resultObj) {
    for (let p in outputObj) {
      if (k === p) {
        outputObj[p] = resultObj[k]
      }
    }
  }
  return outputObj;
}

function objectPrompter(promptObj, outputObj, cb) {
  prompt.get(promptObj, function(err:any, result:any) {
    let resultObj = result;

    if (result.pos) {
      cb();
    } else if (result.neg) {
      cb();
    } else {
      cb();
    }
  })
}


function childProcess(string, cb) {
  exec(string, function(error:any, stdout:any, stderr:any) {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    } else {
      console.log(`stdout:${stdout}`);
      cb();
    }
  })
}


export { applyDefaults, psqlCommand, fileChecker, makeJSONfromObj, remoteConnectCommand, createUserAndDB, binaryPrompter, resultToObject, objectPrompter, childProcess };
