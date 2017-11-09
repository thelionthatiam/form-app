import { deepMerge } from '../functions/deepMerge.js';
import * as dbDefault from './db-default.json';
import * as dbCustom from './db-custom.json';

let dbConfig = deepMerge(dbDefault, dbCustom); 

export { dbConfig };
