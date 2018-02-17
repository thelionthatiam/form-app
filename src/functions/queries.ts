import { Inputs } from '../../typings/typings';
import { Client } from '../../node_modules/@types/pg/index'
import * as r from '../resources/valie-objects';

// DATA ACCESS TIER


class Query {
  conn:Client;

  constructor(conn:Client) {
    this.conn = conn;
  }

  // select
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

  selectAlarms(values:string[]) {
    const query = 'SELECT * FROM alarms WHERE user_uuid = $1'
    return this.conn.query(query, values);
  }

  selectUnpaidSnoozes(values:string[]) {
    const query = 'SELECT * FROM snoozes WHERE user_uuid = $1 AND paid = $2'
    return this.conn.query(query, values);
  }

  selectUnpaidDismisses(values:string[]) {
    const query = 'SELECT * FROM dismisses WHERE user_uuid = $1 AND paid = $2'
    return this.conn.query(query, values);
  }

  selectUnpaidWakes(values:string[]) {
    const query = 'SELECT * FROM wakes WHERE user_uuid = $1 AND paid = $2'
    return this.conn.query(query, values);
  }

  selectUserSettings(values:string[]) {
    const query = 'SELECT * FROM user_settings where user_uuid = $1'
    return this.conn.query(query, values)
  }

  selectPendingPayments(values:string[]) {
    const query = 'SELECT org_trans_total FROM org_transactions WHERE org_uuid = $1 AND sent = $2';
    return this.conn.query(query, values)
  }

  // insert
  insertSnooze(values:string[]) {
    const query = 'INSERT INTO snooze(user_uuid, alarm_uuid, recipient, org_trans_total, sent) VALUES ($1, $2, $3, $4, $5)';
    return this.conn.query(query, values);
  }

  insertTransaction(values:string[]) {
    const query = 'INSERT INTO transactions(user_uuid, recipient, payment_uuid, snoozes, dismisses, wakes, total) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    return this.conn.query(query, values)
  }

  insertOrgPayment(values:string[]) {
    const query = 'INSERT INTO org_transactions(trans_uuid, user_uuid, recipient, org_trans_total, sent) VALUES ($1, $2, $3, $4, $5)'
    return this.conn.query(query, values)
  }

  insertRevenue(values:string[]) {
    const query = 'INSERT INTO revenue(trans_uuid, user_uuid, trans_revenue_total) VALUES ($1, $2, $3)'
    return this.conn.query(query, values)
  }

  // update
  updateSessionID(values:string[]) {
    const query = 'UPDATE session SET sessionid = $1 WHERE user_uuid = $2';
    return this.conn.query(query, values);
  }

  snoozesToPaid(values:string[]) {
    const query = 'UPDATE snoozes SET paid = $1 WHERE snooze_uuid = $2';
    return this.conn.query(query, values);
  }
  dismissesToPaid(values:string[]) {
    const query = 'UPDATE dismisses SET paid = $1 WHERE dismiss_uuid = $2';
    return this.conn.query(query, values);
  }
  wakesToPaid(values:string[]) {
    const query = 'UPDATE wakes SET paid = $1 WHERE wake_uuid = $2';
    return this.conn.query(query, values);
  }

  orgToPaid(values:string[]) {
    const query = 'UPDATE org_transactions SET sent = $1 WHERE recipient = $2';
    return this.conn.query(query, values);
  }
  // delete

};


export { Query };
