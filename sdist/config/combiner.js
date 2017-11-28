"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepMerge_js_1 = require("../functions/deepMerge.js");
const dbConfigDefault = require("./db-default.json");
const dbOptions = require("credentials.json");
let dbDefault = deepMerge_js_1.deepMerge(dbConfigDefault, dbOptions);
function combine() {
    let dbInfo = {};
    try {
        let dbCustom = require('./db-custom.json');
        console.log('using custom');
        dbInfo = deepMerge_js_1.deepMerge(dbDefault, dbCustom);
        return dbInfo;
    }
    catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            console.log('using default');
            dbInfo = dbDefault;
            return dbInfo;
        }
        else {
            console.log(e);
        }
    }
}
let dbConfig = combine();
exports.dbConfig = dbConfig;
//# sourceMappingURL=combiner.js.map