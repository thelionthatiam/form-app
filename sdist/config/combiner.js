"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepMerge_js_1 = require("../functions/deepMerge.js");
const dbDefault = require("./db-default.json");
function combine() {
    let dbInfo = {};
    try {
        let dbCustom = require('./db-custom.json');
        dbInfo = deepMerge_js_1.deepMerge(dbDefault, dbCustom);
        console.log("current database settings: ", deepMerge_js_1.deepMerge(dbDefault, dbCustom));
        return dbInfo;
    }
    catch (e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            console.log('using default database settings');
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