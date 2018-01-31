"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const queries_1 = require("../functions/queries");
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
            // events to release
            req.on('abort', () => {
                client.release();
            });
            req.on('timeout', () => {
                req.abort();
            });
            res.on('close', () => {
                client.release();
            });
            res.on('finish', function () {
                client.release();
            });
            req.db = new queries_1.Query(client);
            next();
        })
            .catch((err) => {
            client.release();
            return console.error('Error executing query', err.stack);
        });
    };
}
exports.init = init;
//# sourceMappingURL=async-database.js.map