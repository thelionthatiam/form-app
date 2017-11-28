import { deepMerge } from '../functions/deepMerge.js';
import * as dbConfigDefault from './db-default.json';
import * as dbOptions  from 'credentials.json';

let dbDefault = deepMerge(dbConfigDefault, dbOptions);

function combine() {
  let dbInfo = {};

  try {
    let dbCustom = require('./db-custom.json');
    console.log('using custom')
    dbInfo = deepMerge(dbDefault, dbCustom);
    return dbInfo;
  } catch(e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.log('using default')
      dbInfo = dbDefault;
      return dbInfo
    } else {
      console.log(e)
    }
  }
}

let dbConfig = combine();

export { dbConfig };
