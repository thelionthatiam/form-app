"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const combiner_1 = require("../config/combiner");
const queries_1 = require("../functions/queries");
const pool = new pg_1.Pool(combiner_1.dbConfig);
let db = {
    query: (text, params) => pool.query(text, params)
};
exports.db = db;
function init(databaseInformation) {
    const pool = new pg_1.Pool(databaseInformation);
    return (req, res, next) => {
        let client;
        pool.connect()
            .then((client) => {
            // events to release
            req.on('abort', () => {
                client.release();
                req.Query = null;
            });
            req.on('timeout', () => {
                req.abort();
            });
            res.on('close', () => {
                client.release();
                req.Query = null;
            });
            res.on('finish', function () {
                client.release();
                req.Query = null;
            });
            req.Query = new queries_1.Query(client);
            next();
        })
            .catch((err) => {
            client.release();
            return console.error('Error executing query', err.stack);
        });
    };
}
//# sourceMappingURL=database.js.map