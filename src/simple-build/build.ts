import * as obj from "./build-objects";
import * as func from "./build-functions";
import { tablesExist, tableDrop, psqlCommand } from "./build-functions";
import { buildTables, noTable } from './build-strings';

interface Result {
  user:string;
  database:string;
  host:string;
  password:string;
}


function build(dbConnect:string, result:Result) {
  // check if tables exist
  console.log(dbConnect);
  func.childProcess(dbConnect + tablesExist, function(error: any, stdout: any, stderr: any) {
    if (error) { // if they do not, build them
      console.error(`exec error: ${error}`);
      if (noTable.test(error)) {
        console.log('No user table, creating tables');
        func.childProcess(dbConnect + buildTables, function(error: any, stdout: any, stderr: any) {
          if (error) {
            console.error(`exec error: ${error}`);
          } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            console.log('tables added to empty database');
            func.makeJSONfromObj('../config/connect-config.json', result); // store that information in a JSON
            return;
          }
        })
      }
    } else { // if they do, ask to delete or exit // consider boolean prompt
      func.makeJSONfromObj('../config/connect-config.json', result); // store that information in a JSON
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      func.prompter(obj.deleteTables, function(err:any, result:any) {
        if (err) {
          console.log(err)
        } else {
          if (result.deleteTables) {
            console.log(result);
            func.childProcess(dbConnect +  tableDrop, function(err:any, result:any) {
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
  })
}

if (func.fileChecker('../config/connect-config.json')) {
  // build with connect string made by passing other prompt obj through
  func.prompter(obj.prevConn, function(err:any, result:any) {
    if (err) {
      console.log(err);
    } else if (result.prevConn) {
      let connConfig = require('../config/connect-config.json');
      let dbConnect = func.connectCommand(connConfig.user, connConfig.host, connConfig.database, connConfig.password)
      build(dbConnect, connConfig);
    } else {
      func.removeConfig;
      return;
    }
  })
} else {
  // build to connect prompt string // make sign in object
  func.prompter(obj.connectPrompt, function(err:any, result:any) {
    if (err) {
      console.log(err);
    } else {
      result = func.applyDefaults(result);
      let dbConnect = func.connectCommand(result.user, result.host, result.database, result.password)
      build(dbConnect, result);
    }
  })
}
