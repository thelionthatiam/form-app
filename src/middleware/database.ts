import { Pool } from 'pg';
import { Query } from '../functions/queries';

function init(databaseInformation:any) {
  const pool = new Pool(databaseInformation);

  return function (req:any, res:any, next:Function) {
    pool.connect((err, client, release) => {

      req.conn = client;
      req.querySvc= new Query(req.conn);
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

export { init };
