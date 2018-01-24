"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// const pool = new Pool(dbConfig);
//
// let db = {
//   query: (text:string, params:any[]) => pool.query(text, params)
// }
function init(databaseInformation) {
    const pool = new pg_1.Pool(databaseInformation);
    return (req, res, next) => {
        let client;
        pool.connect()
            .then((client) => {
            req.db = client;
            console.log('db middleware check out client', req.db.processID, req.db.readyForQuery);
            next();
        })
            .catch((err) => {
            req.db.release();
            return console.error('Error executing query', err.stack);
        });
    };
}
exports.init = init;
//# sourceMappingURL=async-database.js.map