const { exec } = require('child_process');
const fs = require('fs');
const prompt = require('prompt')
const buildTables = ' -a -f ./sdist/build/database-build.sql'
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

let tablesExist = psqlCommand(["SELECT * FROM users", "SELECT * FROM nonce"]);
let tableDrop = psqlCommand(["DROP TABLE nonce", "DROP TABLE users"]);

function dbAndTable(promptOpts:any, adminRemote: any, adminConnect: any) { // must be useable for local build too

  prompt.get(promptOpts, function(err:any, result:any) {
    console.log('db', result.database)
    console.log('user', result.username)
    let databaseRemote = {
      database: result.database,
      username: result.username,
      host: adminRemote.host,
      password:adminRemote.password
    }
    databaseRemote = applyDefaults(databaseRemote);
    let databaseConnect = remoteConnectCommand(databaseRemote.username, databaseRemote.host, databaseRemote.database, databaseRemote.password);
    let makeUserAndDB = createUserAndDB(databaseRemote.username, databaseRemote.database)

    exec(adminConnect + makeUserAndDB, (error:any, stdout:any, stderr:any) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      } else {
        console.log(`stdout:${stdout}`);
        exec(databaseConnect + ' -a -f ./build/database-build.sql', (error:any, stdout:any, stderr:any)=> {
          if (error) {
            console.error(`exec error: ${error}`);
            return
          } else {
            console.log(`stout:${stdout}`);
            makeJSONfromObj('./config/connnect-config', databaseRemote); // will merge with db-config
          }
        })
      }
    })
  })
}

function tableBuild(adminRemote:any) {
  // let databaseRemote = adminRemote;
  // let databaseConnect = remoteConnectCommand(databaseRemote.username, databaseRemote.host, databaseRemote.database, databaseRemote.password);

  exec (adminRemote + buildTables, (error:any, stdout:any, stderr:any)=> {
    if (error) {
      console.error(`exec error: ${error}`);
      return
    } else {
      console.log(`stout:${stdout}`);
      // makeJSONfromObj('./config/connnect-config', databaseRemote);
    }
  })
}

function adminDBorNewDB(adminRemote:any,adminConnect:any) {
  let sameSettings = {
    properties: {
      choice: {
        description:"use same database and user or create new (same/create)",
        message:"Use a string (same/create)",
        required:true,
        type:'string'
      }
    }
  }

  prompt.get(sameSettings, function(err:any, result:any) {
    if (result.choice === "same") {
      let databaseRemote = adminRemote;
      let databaseConnect = remoteConnectCommand(databaseRemote.username,databaseRemote.host, databaseRemote.database, databaseRemote.password);
      console.log(databaseConnect)
      exec (databaseConnect + buildTables, (error:any, stdout:any, stderr:any)=> {
        if (error) {
          console.error(`exec error: ${error}`);
          return
        } else {
          console.log(`stout:${stdout}`);
          // makeJSONfromObj('./config/connnect-config', databaseRemote);
        }
      })
    } else if (result.choice === "create") {
      let newDBoptions = {
        properties: {
          database: {
            description:"choose a name for the database you would like to create(enter for default: formapp)",
            message:"Use a string",
            type:'string'
          },
          username: {
            description:"choose a username to own the database(enter for default: formadmin)",
            message:"Use a string",
            type:'string'
          }

        }
      }
      dbAndTable(newDBoptions, adminRemote, adminConnect);
    } else {
      console.log('there was an error, try again')
      return;
    }
  })
}

function localDBandTable(adminConnect:any) {
  let newDBoptions = {
    properties: {
      database: {
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
  prompt.get(newDBoptions, function( err: any, result: any) {
    let databaseLocal = {
      database:result.database,
      username:result.username,
      password:result.password
    }
    databaseLocal = applyDefaults(databaseLocal);
    let connectLocal = 'psql -d ' + databaseLocal.database;

    exec(adminConnect + createUserAndDB(databaseLocal.username, databaseLocal.database), (error:any, stdout:any, stderr:any) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return;
      } else {
        console.log(`stdout:${stdout}`);
        exec (connectLocal + buildTables, (error:any, stdout:any, stderr:any)=> {
          if (error) {
            console.error(`exec error: ${error}`);
            return
          } else {
            console.log(`stout:${stdout}`);
            makeJSONfromObj('./sdist/config/connect-config.json', databaseLocal)
          }
        })
      }
    })
  })
}

export { adminDBorNewDB, tableBuild, localDBandTable, dbAndTable, applyDefaults, psqlCommand, fileChecker, remoteConnectCommand, makeJSONfromObj, createUserAndDB, tablesExist, buildTables, tableDrop};
