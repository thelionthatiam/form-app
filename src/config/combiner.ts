import { deepMerge } from '../functions/deepMerge.js';
import * as dbDefault from './db-default.json';

function combine() {
  let dbInfo = {};

  try {
    let dbCustom = require('./db-custom.json');
    dbInfo = deepMerge(dbDefault, dbCustom);
    return dbInfo;
  } catch(e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      dbInfo = dbDefault;
      return dbInfo
    } else {
      console.log(e)
    }
  }
}

let dbConfig = combine();

export { dbConfig };
