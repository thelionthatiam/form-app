const { Pool } = require('pg');
const { Query } = require('../functions/queries');

function init(databaseInformation) {
  const pool = new Pool(databaseInformation);
  console.log('pool establsihed')
  return function (req, res, next) {
    pool.connect((err, client, release) => {
      console.log('pool connected')
      req.conn = client;
      req.querySvc = new Query(req.conn);
      next();

      if (err) {
        return console.error('Error acquiring client', err.stack);
      }
      client.query('SELECT NOW()', (err, result) => {
        release();
        console.log('client released')
        if (err) {
          return console.error('Error executing query', err.stack);
        }
      });
    });


  };
}

module.exports = {
  init: init
};

//
