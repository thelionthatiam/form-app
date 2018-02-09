import { Inputs } from '../../typings/typings';
import { Client } from '../../node_modules/@types/pg/index'
import * as r from '../resources/valie-objects';

// DATA ACCESS TIER


class Query {
  conn:Client;

  constructor(conn:Client) {
    this.conn = conn;
  }

  selectUser(values:string[]) {
    const query = "SELECT * FROM users WHERE email = $1"
    return this.conn.query(query, values);
  }

  selectUserOrgs(values:string[]) {
    const query = "SELECT * FROM user_orgs WHERE user_uuid = $1"
    return this.conn.query(query, values);
  }

  selectOrder(values:string[]) {
    const query = "SELECT * FROM orders WHERE user_uuid = $1"
    return this.conn.query(query, values);
  }

  selectCart(values:string[]) {
    const query = 'SELECT * FROM cart WHERE user_uuid = $1'
    return this.conn.query(query, values);
  }

  selectOrgs(values:string[]) {
    const query = 'SELECT * FROM orgs'
    return this.conn.query(query, values);
  }

  updateSessionID(values:string[]) {
    const query = 'UPDATE session SET sessionid = $1 WHERE user_uuid = $2';
    return this.conn.query(query, values);
  }
};


export { Query };
