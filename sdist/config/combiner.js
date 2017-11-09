"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deepMerge_js_1 = require("../functions/deepMerge.js");
const dbDefault = require("./db-default.json");
const dbCustom = require("./db-custom.json");
let dbConfig = deepMerge_js_1.deepMerge(dbDefault, dbCustom);
exports.dbConfig = dbConfig;
//# sourceMappingURL=combiner.js.map