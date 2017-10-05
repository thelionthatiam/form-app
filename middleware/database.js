const { Pool } = require('pg');
const { Query } = require('./functions/queries');

function init(databaseInformation) {
  const pool = new Pool(databaseInformation);

  return function (req, res, next) {
    req.conn = client;
    req.conn.connect((err, client, release) => {
      if (err) {
        return console.error('Error acquiring client', err.stack)
      }
      client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        // console.log(result.rows)
      })
    })

  req.querySvc = new Query(conn);
  next();
  };
}

module.exports = {
  init: init
};

//
