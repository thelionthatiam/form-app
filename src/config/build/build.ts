import * as obj from "./build-objects";
import * as func from "./build-functions";
import * as fs from 'fs';
import { tablesExist, tableDrop, psqlCommand } from "./build-functions";
import { buildTables, noTable } from './build-strings';


let command = " --command="
let informationSchema = '"SELECT * FROM information_schema.tables WHERE table_schema = \'public\'"'
let tablesExists = command + informationSchema;

function build(dbConnect:string, result:func.Result , cb:Function) {
  let jsonConfig = result
  func.childProcess(dbConnect + tablesExists, function(err:Error, stdout:string, stderr:string) {
      if (err) {
        console.log(err);
      } else { // if they do, ask to delete or exit
        console.log(`stdout: ${stdout}`);
        if (noTable.test(stdout)) {
          fs.readdir('./database-builds/up', function(err, files) {
            if (err) {
              return err;
            } else {
              obj.whatVersion.properties.version.default = files.length
              func.prompter(obj.whatVersion, function(err:string, result:func.Result) {
                if (err) {
                  console.log(err)
                } else {
                  func.filesInDir('./database-builds/up', function(err:Error, files:[string]){
                    if (err) {
                      console.log(err)
                    } else {
                      let fileString = func.stringOfFiles('./database-builds/up', files, result.version, false);
                      console.log(fileString);
                      func.childProcess(dbConnect + fileString, function(err:Error, stdout:string, stderr:string) {
                        if (err) {
                          console.error(`exec error: ${err}`);
                          cb(err);
                        } else {
                          console.log(`stdout: ${stdout}`);
                          console.log(`stderr: ${stderr}`);
                          console.log('tables added to empty database');
                          func.makeJSONfromObj('./sdist/config/connect-config.json', jsonConfig, function(err:string) { // store that information in a JSON
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
                  })
                }
              })
            }
          })
        } else {
          console.log('this is where I should be')
          console.log('successfuly made config JSON')
          func.prompter(obj.deleteTables, function(err:string, result:func.Result) {
            if (err) {
              console.log(err)
            } else {
              func.filesInDir('./database-builds/down', function(err:Error, files:[string]){
                if (err) {
                  console.log(err)
                  cb(err);
                } else {
                  let fileString = func.stringOfFiles('./database-builds/down', files, result.versionDown, true);
                  console.log(fileString)
                  func.childProcess(dbConnect + fileString, function(err:Error, stdout:string, stderr:string) {
                    if (err) {
                      console.error(`exec error: ${err}`);
                      cb(err);
                    } else {
                      console.log(`stdout: ${stdout}`);
                      console.log(`stderr: ${stderr}`);
                      cb()
                    }
                  })

                }
              })
            }
          })
        }
    }
  })
}
console.log(func.fileChecker('../connect-config.json'))


if (func.fileChecker('../connect-config.json')) {
  // build with connect string made by passing other prompt obj through
  func.prompter(obj.prevConn, function(err:string, result:func.Result) {
    if (err) {
      console.log(err);
    } else if (result.prevConn || result.prevConn === '') {
      let connConfig = require('../connect-config.json');
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
  func.prompter(obj.connectPrompt, function(err:string, result:func.Result) {
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
