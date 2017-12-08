import * as obj from "./build-objects";
import * as func from "./build-functions";
import { tablesExist, tableDrop, psqlCommand } from "./build-functions";
import { buildTables, noTable } from './build-strings';

interface Result {
  user:string;
  database:string;
  host:string;
  password:string;
  deleteTables:String;
  prevConn:string;
}


function build(dbConnect:string, result:Result , cb:Function) {
  // check if tables exist
  func.childProcess(dbConnect + tablesExist, function(err:Error, stdout:string, stderr:string) {
    if (err) { // if they do not, build them
      console.log('tables do not exist');
      console.error(`exec error: ${err}`);
      if (noTable.test(JSON.stringify(err))) {
        console.log('No user table, creating tables');
        func.childProcess(dbConnect + buildTables, function(err:Error, stdout:string, stderr:string) {
          if (err) {
            console.error(`exec error: ${err}`);
            cb(err);
          } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            console.log('tables added to empty database');
            func.makeJSONfromObj('./sdist/config/connect-config.json', result, function(err:string) { // store that information in a JSON
              if(err) {
                console.log(err)
                cb(err);
              } else {
                console.log('successfuly made config JSON')
                cb();
              }
            });
          }
        })
      }
    } else { // if they do, ask to delete or exit // consider boolean prompt
      console.log('tables exist');
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      func.makeJSONfromObj('./sdist/config/connect-config.json', result, function(err:string) { // store that information in a JSON
        if (err) {
          console.log(err);
          cb(err);
        } else {
          console.log('successfuly made config JSON')
          func.prompter(obj.deleteTables, function(err:Error, result:Result) {
            if (err) {
              console.log(err)
              cb(err);
            } else {
              if (result.deleteTables) {
                console.log(result);
                func.childProcess(dbConnect +  tableDrop, function(err:Error, stdout:string, stderr:string) {
                  if (err) {
                    console.log(err);
                    cb(err);
                  } else {
                    console.log(result);
                    cb();
                  }
                })
              } else {
                console.log('tables not deleted');
                cb();
              }
            }
          })
        }
      });
    }
  })
}

if (func.fileChecker('../config/connect-config.json')) {
  // build with connect string made by passing other prompt obj through
  func.prompter(obj.prevConn, function(err:string, result:Result) {
    if (err) {
      console.log(err);
    } else if (result.prevConn) {
      let connConfig = require('../config/connect-config.json');
      let dbConnect = func.connectCommand(connConfig.user, connConfig.host, connConfig.database, connConfig.password)
      build(dbConnect, connConfig, function (err:Error) {
        if (err) {
          console.log('something went wrong with the build script. This is likely a bug, try again/contact developer here is the error: ' + err)
        } else {
          console.log('build script complete')
        }
      });
    } else {
      func.removeConfig('./sdist/config/connect-config.json', function(err:string){
        if (err) {
          console.log(err)
        } else {
          console.log('successfully deleted');
        }
      });
    }
  })
} else {
  // build to connect prompt string // make sign in object
  func.prompter(obj.connectPrompt, function(err:string, result:Result) {
    if (err) {
      console.log(err);
    } else {
      result = func.applyDefaults(result);
      let dbConnect = func.connectCommand(result.user, result.host, result.database, result.password)
      build(dbConnect, result, function(err:Error) {
        if (err) {
          console.log('something went wrong with the build script. This is likely a bug, try again/contact developer here is the error: ' + err)
        } else {
          console.log('build script complete')
        }
      });
    }
  })
}
