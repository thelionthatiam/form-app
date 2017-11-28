// ES6?
const { exec } = require('child_process');
const prompt = require('prompt')
const fs = require('fs');
import * as dbConfig from '../config/combiner';
import * as hbs from "express-handlebars";
import { applyDefaults } from './build-assets';

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
      description:"remote database name",
      message:"use a string",
      type:"string"
    },
    username: {
      description:"remote database username",
      message:"use a string",
      type:"string"
    },
    password: {
      description:"remote database password",
      message:"use a string",
      type:"string"
    },
    host: {
      description:"remote database host",
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

function remoteConnectCommand(user:string, host:string, dbname:string, password:string) {
  let connectCommand =
      "PGPASSWORD=" + password +
      " psql" +
      " -U " + user +
      " -h " + host +
      " -d " + dbname
  return connectCommand;
}

function credentialSet() {
  try {
    let dbOptions = require('../config/credentials.json');
    let signInNewDB = remoteConnectCommand(dbOptions.username, dbOptions.host, dbOptions.dbname, dbOptions.password);
    if (typeof dbOptions.host === 'undefined') {
      console.log('Please delete your /config/credentials.json and start again.')
      return;
    }
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
      console.log("You said ", result.dbname);
      console.log("You said ", result.host);
      console.log("You said ", result.username);
      console.log("You said ", result.password);

      let dbOptions:any = {
        dbname:result.dbname,
        username:result.username,
        password:result.password,
        host:result.host
      }

      let signIn = remoteConnectCommand(dbOptions.username, dbOptions.host, dbOptions.dbname, dbOptions.password);
      let sameSettings = {
        properties: {
          choice: {
            description:"use same dbname and user or create new (same/create)",
            message:"Use a string (same/cerate)",
            required:true,
            type:'string'
          }
        }
      }
      prompt.start();
      prompt.get(sameSettings, function(err:any, result:any) {
        if (result.choice === "same") {
          exec (signIn + ' -a -f ./build/database-build.sql', (error:any, stdout:any, stderr:any)=> {
            if (error) {
              console.error(`exec error: ${error}`);
              return
            } else {
              console.log(`stout:${stdout}`);
              makeJSONfromObj(dbOptions);
            }
          })
        } else {
          let userDefined = {
            properties: {
              user: {
                description:"choose a name for the database you would like to create(enter for default: formapp)",
                message:"Use a string",
                required:true,
                type:'string'
              },
              dbname: {
                description:"choose a username to own the database(enter for default: formadmin)",
                message:"Use a string",
                required:true,
                type:'string'
              }
            }
          }
          prompt.start();
          prompt.get(userDefined, function(err:any, result:any) {
            console.log("You said ", result.dbname)
            console.log("You said ", result.username)

            dbOptions.newdbname = result.dbname, // adding new property
            dbOptions.newusername = result.username, // adding new property
            dbOptions = applyDefaults(dbOptions);

            //sign in for newly created database
            let signInNewDB = remoteConnectCommand(dbOptions.newusername, dbOptions.host, dbOptions.newdbname, dbOptions.password);

            let createdb:string = "CREATE DATABASE " + dbOptions.newdbname + ";";
            let createuser:string = "CREATE USER " + dbOptions.newusername + ";";
            let grantPriv:string = "GRANT ALL PRIVILEGES ON DATABASE " + dbOptions.newdbname + " TO " + dbOptions.newusername + ";";
            let superUser:string = "ALTER USER " + dbOptions.newusername + " WITH SUPERUSER;";
            let makeUserAndDB = psqlCommand([createdb, createuser, grantPriv, superUser]);

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
                    makeJSONfromObj(dbOptions);
                  }
                })
              }
            })
          })
        }
      })
    })
  }
}

credentialSet();
