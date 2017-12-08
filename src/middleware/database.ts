import { Pool } from 'pg';
import { Query } from '../functions/queries';
import { ConnectionConfig } from '../../node_modules/@types/pg/index'; // pg types
import { ModRequest } from '../../typings/typings';
import { RequestHandler } from '../../node_modules/@types/express-serve-static-core/index'
import * as express from "express";

function init(databaseInformation:ConnectionConfig):RequestHandler {
  const pool = new Pool(databaseInformation);

  return function(req, res, next) { // extend express Request
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
