const { exec } = require('child_process');
const prompt = require('prompt');
const fs = require('fs');
import * as dbDefault from '../config/db-default.json';
import * as dbConfig from '../config/combiner';
import * as dbCredentials from '../config/user-db-pass.json';

// organize for psql command
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

let credentialOptions = {
  properties: {
    dbname: {
      description:"choose a name for the database you would like to create(enter for default: formapp)",
      message:"use a string",
      type:"string"
    },
    username: {
      description:"choose a username to own the database(enter for default: formadmin)",
      message:"use a string",
      type:"string"
    },
    password: {
      description:"supply the password associated with the database(enter for default: formpassword)",
      message:"use a string",
      type:"string"
    }
  }
}

let restart = {
  properties: {
      redo: {
        description:"Use new credentials",
        message:"use true or false",
        type:"boolean"
    }
  }
}

function makeJSONfromObj(obj:any) {
  let data = JSON.stringify(obj);
  fs.writeFileSync('./config/credentials.json', data)
}

function applyDefaults(obj:any) {
  for(let k in obj) {
    if (k === 'dbname' && obj[k] === '') {
      console.log(obj[k], "in dbname")
      obj.dbname = 'formapp';
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

function credentialSet() {
  try {
    let dbOptions = require('../config/credentials.json');
    let signInNewDB = 'psql -d ' + dbOptions.dbname + " ";

    let doUsersExist = "SELECT * FROM users";
    let doNonceExist = "SELECT * FROM nonce"
    let tablesExist = psqlCommand([doUsersExist, doNonceExist]);

    exec(signInNewDB + tablesExist, (error:any, stdout:any, stderr:any) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      } else {
        console.log(`stdout:${stdout}`);
        console.log('everything is working, what do you want?')
        prompt.start()
        prompt.get(restart, function( err: any, result: any) {
          console.log("You said ", result.redo);
          if (result.redo === true) {
            fs.unlink('./config/credentials.json', function() {
              console.log("Run this file again to set up new database. Don't forget to scrub your old db.")
            })
          }

        })
      }
    })
  } catch(e) {
    prompt.start()
    prompt.get(credentialOptions, function( err: any, result: any) {
      console.log("You said ", result.dbname)
      console.log("You said ", result.username)
      console.log("You said ", result.password)
      let dbOptions = {
        dbname:result.dbname,
        username:result.username,
        password:result.password
      }

      dbOptions = applyDefaults(dbOptions);

      // CREATE DATABASE formapp;
      // CREATE USER formadmin;

      // GRANT ALL PRIVILEGES ON DATABASE formapp TO formadmin;
      // ALTER USER formadmin WITH SUPERUSER;
      let createdb:string = "CREATE DATABASE " + dbOptions.dbname + ";";
      let createuser:string = "CREATE USER " + dbOptions.username + ";";
      let grantPriv:string = "GRANT ALL PRIVILEGES ON DATABASE " + dbOptions.dbname + " TO " + dbOptions.username + ";";
      let superUser:string = "ALTER USER " + dbOptions.username + " WITH SUPERUSER;";
      let makeUserAndDB = psqlCommand([createdb, createuser, grantPriv, superUser]);

      let signIn = 'psql postgres';
      //sign in for newly created database
      let signInNewDB = 'psql -d ' + dbOptions.dbname;

      exec(signIn + makeUserAndDB, (error:any, stdout:any, stderr:any) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        } else {
          console.log(`stdout:${stdout}`);
          exec (signInNewDB + ' -a -f ./build/database-build.sql', (error:any, stdout:any, stderr:any)=> {
            if (error) {
              console.error(`exec error: ${error}`);
              return
            } else {
              console.log(`stout:${stdout}`);
              makeJSONfromObj(dbOptions)
            }
          })
        }
      })
    })
  }
}

credentialSet();
