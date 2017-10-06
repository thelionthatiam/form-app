const { Pool } = require('pg');
const { Query } = require('./functions/queries');

function init(databaseInformation) {
  const pool = new Pool(databaseInformation);

  return function (req, res, next) {

    pool.connect((err, client, release) => {
      // client is defined in the connect method
      req.conn = client;
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT NOW()', (err, result) => {
        req.querySvc = new Query(req.conn);
        release()
        if (err) {
          return console.error('Error executing query', err.stack)
        }
      })
    })


  next();
  };
}

module.exports = {
  init: init
};

//
