// ES6?
const { exec } = require('child_process');
const prompt = require('prompt')
const fs = require('fs');
import * as dbConfig from '../config/combiner';
import * as hbs from "express-handlebars";
import { adminDBorNewDB, tableBuild, dbAndTable, psqlCommand, applyDefaults, makeJSONfromObj, remoteConnectCommand, createUserAndDB, tablesExist, buildTables, fileChecker, tableDrop} from './build-assets';
const argv = require('yargs')
  .describe('r', 'use remote database true or false')
  .boolean('r')
  .help('h')
  .argv;

let adminOnly = {
  properties: {
      newDB: {
        description:"Seems to be no database info. Use previous admin login to create fresh database or remove admin login to start all over? (newDB/freshStart)",
        message:"use responses newDB or freshStart",
        type:"string"
    }
  }
}

let dbOnly = {
  properties: {
    newTables: {
      description:"Make new tables or delete database (newTables, deleteDatabse)",
      message:"use newTables or deleteDatabase",
      type:"string"
    }
  }
}

function remoteBuilder() {

  if (fileChecker('../config/admin-config.json')) {
    let adminRemote = require('../config/admin-config.json');
    let adminConnect = remoteConnectCommand(adminRemote.username, adminRemote.host, adminRemote.database, adminRemote.password);

    if (fileChecker('../config/connect-config.json')) {
      let databaseRemote = require('../config/connect-config.json');
      let databaseConnect = remoteConnectCommand(databaseRemote.username, databaseRemote.host, databaseRemote.database, databaseRemote.password);
      prompt.start()
      prompt.get(dbOnly, function( err: any, result: any) {
        if (result.newTables) {
          exec(databaseConnect + tableDrop, (error:any, stdout:any, stderr:any)=> {
            if (error) {
              console.error(`exec error: ${error}`);
              return
            } else {
              tableBuild(adminRemote)
            }
          })
        } else {
          let dbDrop = psqlCommand(["DROP DATABASE " + databaseRemote.database, "DROP USER " + databaseRemote.username]);
          exec(adminConnect + dbDrop, (error:any, stdout:any, stderr:any)=> {
            if (error) {
              console.error(`exec error: ${error}`);
              return
            } else {
              fs.unlink('./config/connect-config.json', function(){})
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
            }
          })
        }
      })
    } else {
      prompt.start()
      prompt.get(adminOnly, function( err: any, result: any) {
        if (result.newDB === "newDB") {
          adminDBorNewDB(adminRemote, adminConnect)
        } else if (result.newDB === "freshStart") {
          fs.unlink('./config/admin-config.json', function(){})
        } else {
          console.log('there was an error try again.')
        }
      })
    }
  } else {
    let adminRemote = {
      properties: {
        database: {
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

    prompt.start()
    prompt.get(adminRemote, function( err: any, result: any) {
      console.log("You said ", result.database, "\nYou said ", result.host, "\nYou said ", result.username, "\nYou said ", result.password);

      let adminRemote:any = {
        database:result.database,
        username:result.username,
        password:result.password,
        host:result.host
      }

      let adminConnect = remoteConnectCommand(adminRemote.username, adminRemote.host, adminRemote.database, adminRemote.password);
      makeJSONfromObj('./config/admin-config.json', adminRemote);

      let sameSettings = {
        properties: {
          choice: {
            description:"use same database and user or create new (same/create)",
            message:"Use a string (same/cerate)",
            required:true,
            type:'string'
          }
        }
      }

      adminDBorNewDB(adminRemote, adminConnect)
    })
  }
}

function localBuilder () {
  let adminLocal = 'psql postgres'
    , adminConnect = 'psql postgres';

  if (fileChecker('../config/connect-config')) {
    let databaseLocal = require('../config/connect-config')
    let connectLocal = 'psql -d ' + databaseLocal.database;
    // what do to with existing db
    prompt.get(dbOnly, function( err: any, result: any) {
      if (result.newTables) {
        exec(connectLocal + tableDrop, (error:any, stdout:any, stderr:any)=> {
          if (error) {
            console.error(`exec error: ${error}`);
            return
          } else {
            tableBuild(adminLocal)
          }
        })
      } else {
        let dbDrop = psqlCommand(["DROP DATABASE " + databaseLocal.database, "DROP USER " + databaseLocal.username]);
        exec(adminLocal + dbDrop, (error:any, stdout:any, stderr:any)=> {
          if (error) {
            console.error(`exec error: ${error}`);
            return
          } else {
            fs.unlink('./config/connect-config.json', function(){})
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
            dbAndTable(newDBoptions, adminLocal, adminConnect);
          }
        })
      }
    })
  } else {
    let adminConnect = 'psql postgres';
    let sameSettings = {
      properties: {
        choice: {
          description:"use existing database or create new (existing/create)",
          message:"Use a string (existing/cerate)",
          required:true,
          type:'string'
        }
      }
    }
    prompt.start();
    prompt.get(sameSettings, function(err:any, result:any) {
      if (result.choice === "existing") {
        // use existing database and create tables
        let existingDB = {
          properties: {
            database: {
              description:"identify database that already exists",
              message:"use a string",
              required:true,
              type:"string"
            },
            username: {
              description:"what is the user that owns the database (can be skipped)",
              message:"use a string",
              type:"string"
            },
            password: {
              description:"what is the password for the database (can be skipped)",
              message:"use a string",
              type:"string"
            }
          }
        }


        prompt.start()
        prompt.get(existingDB, function(err:any, result:any) {
          let databaseLocal = {
            database:result.database,
            username:result.username,
            password:result.password
          }
          let connectLocal = 'psql -d ' + result.database + " ";
          exec (connectLocal + buildTables, (error:any, stdout:any, stderr:any)=> {
            if (error) {
              console.error(`exec error: ${error}`);
              return
            } else {
              console.log(`stout:${stdout}`);
              makeJSONfromObj('./config/connect-config.json', databaseLocal)
            }
          })
        })
      } else if (result.choice === "create") {
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
        prompt.start()
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
                  makeJSONfromObj('./config/connect-config.json', databaseLocal)
                }
              })
            }
          })
        })
      }
    })
  }
}

  if (argv.r === true) {
    remoteBuilder();
  } else {
    console.log('Default, with no arguements is local db build. Use -r true for remote database.')
    localBuilder();
  }
