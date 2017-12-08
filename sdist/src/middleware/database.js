"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const queries_1 = require("../functions/queries");
function init(databaseInformation) {
    const pool = new pg_1.Pool(databaseInformation);
    return function (req, res, next) {
        // let modReq = <ModRequest>req
        pool.connect((err, client, release) => {
            req.conn = client;
            let querySvc;
            req.querySvc = new queries_1.Query(req.conn);
            next();
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query('SELECT NOW()', (err, result) => {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack);
                }
            });
        });
    };
}
exports.init = init;
//# sourceMappingURL=database.js.map