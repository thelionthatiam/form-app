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


function build(dbConnect:string, result:Result) {
  // check if tables exist
  func.childProcess(dbConnect + tablesExist, function(error:string, stdout:string, stderr:string) {
    if (error) { // if they do not, build them
      console.error(`exec error: ${error}`);
      if (noTable.test(error)) {
        console.log('No user table, creating tables');
        func.childProcess(dbConnect + buildTables, function(error:string, stdout:string, stderr:string) {
          if (error) {
            console.error(`exec error: ${error}`);
          } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            console.log('tables added to empty database');
            func.makeJSONfromObj('../config/connect-config.json', result, function(err:string) { // store that information in a JSON
              if(err) {
                console.log(err)
              } else {
                console.log('successfuly made config JSON')
                return;
              }
            });

          }
        })
      }
    } else { // if they do, ask to delete or exit // consider boolean prompt
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      func.makeJSONfromObj('../config/connect-config.json', result, function(err:string) { // store that information in a JSON
        if (err) {
          console.log(err)
        } else {
          console.log('successfuly made config JSON')
          func.prompter(obj.deleteTables, function(err:string, result:Result) {
            if (err) {
              console.log(err)
            } else {
              if (result.deleteTables) {
                console.log(result);
                func.childProcess(dbConnect +  tableDrop, function(err:string, result:Result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result);
                    return;
                  }
                })
              } else {
                console.log('tables not deleted');
                return;
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
      build(dbConnect, connConfig);
    } else {
      func.removeConfig('../config/connect-config.json', function(err:string){
        if (err) {
          console.log(err)
        } else {
          console.log('successfully deleted');
        }
      });
      return;
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
      build(dbConnect, result);
    }
  })
}
