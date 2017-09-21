const { Pool } = require('pg');

function init(databaseInformation) {
  return function (req, res, next) {
    const pool = new Pool(databaseInformation);
    req.conn = pool;

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

  next();
  };
}

module.exports = {
  init: init
};
