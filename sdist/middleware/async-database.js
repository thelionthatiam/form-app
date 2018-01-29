"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const combiner_1 = require("../config/combiner");
const pool = new pg_1.Pool(combiner_1.dbConfig);
let db = {
    query: (text, params) => pool.query(text, params)
};
exports.db = db;
function init(databaseInformation) {
    const pool = new pg_1.Pool(databaseInformation);
    return (req, res, next) => {
        let client;
        res.on('finish', function () {
            console.log("\x1b[36m", 'NEW CLIENT RELEASE');
            console.log(req.db);
            req.db.release();
        });
        pool.connect()
            .then((client) => {
            req.db = client;
            next();
        })
            .catch((err) => {
            console.log('fired');
            req.db.release();
            return console.error('Error executing query', err.stack);
        });
    };
}
exports.init = init;
//# sourceMappingURL=async-database.js.map