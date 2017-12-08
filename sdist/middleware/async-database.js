"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const combiner_1 = require("../config/combiner");
const pool = new pg_1.Pool(combiner_1.dbConfig);
let db = {
    query: (text, params) => pool.query(text, params)
};
exports.db = db;
//# sourceMappingURL=async-database.js.map