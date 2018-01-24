import { Pool } from 'pg';
import { dbConfig } from "../config/combiner";
import { RequestHandler } from '../../node_modules/@types/express-serve-static-core/index'
import { ConnectionConfig, Client } from '../../node_modules/@types/pg/index'; // pg types
import * as express from "express";

// const pool = new Pool(dbConfig);
//
// let db = {
//   query: (text:string, params:any[]) => pool.query(text, params)
// }

function init(databaseInformation:ConnectionConfig):RequestHandler {
  const pool = new Pool(databaseInformation);

  return (req, res, next) => {
    let client:any;

    pool.connect()
      .then((client:Client) => {
        req.db = client;
        console.log('db middleware check out client', req.db.processID, req.db.readyForQuery)
        next();
      })
      .catch((err) => {
        req.db.release();
        return console.error('Error executing query', err.stack);
      })
    };
}


export { init };
