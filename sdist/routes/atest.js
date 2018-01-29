"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const combiner_1 = require("../config/combiner");
const pool = new pg_1.Pool(combiner_1.dbConfig);
pool.connect()
    .then(client => {
    return client.query('SELECT * FROM users', [])
        .then(res => {
        console.log(client);
        client.release();
        console.log(client);
        console.log(res.rows[0]);
    })
        .catch(e => {
        client.release();
        console.log(err.stack);
    });
});
//# sourceMappingURL=atest.js.map