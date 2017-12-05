import { Pool } from 'pg';
import { Query } from '../functions/queries';

interface connectObj {
  user:string;
  database:string;
  host:string;
  password:string;
  port:number;
}


function init(databaseInformation:connectObj) {
  const pool = new Pool(databaseInformation);

  return function(req:Request, res:Response, next:Function) { // extend express
    pool.connect((err, client, release) => {
      req.conn = client;
      req.querySvc = new Query(req.conn);
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
