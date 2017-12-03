import { applyDefaults, psqlCommand, fileChecker, makeJSONfromObj, remoteConnectCommand, createUserAndDB, binaryPrompter, resultToObject, objectPrompter, childProcess } from './build-functions';

function builder() {
  if (fileChecker(pathOne)){
    if(fileChecker(pathTwo)) {
      promptOne
      binaryPrompter(promptObj, function() {
        // somehow run desired function 
      })
    }
  }
}
