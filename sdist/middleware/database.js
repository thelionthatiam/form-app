var Pool = require('pg').Pool;
var Query = require('../functions/queries').Query;
function init(databaseInformation) {
    var pool = new Pool(databaseInformation);
    return function (req, res, next) {
        pool.connect(function (err, client, release) {
            req.conn = client;
            req.querySvc = new Query(req.conn);
            next();
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client.query('SELECT NOW()', function (err, result) {
                release();
                if (err) {
                    return console.error('Error executing query', err.stack);
                }
            });
        });
    };
}
module.exports = { init: init };
//
//# sourceMappingURL=database.js.map