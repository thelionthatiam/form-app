import { ConnectionConfig, Client } from './../node_modules/@types/pg/index'; // pg types
import { Request, Response, RequestHandler } from './../node_modules/@types/express-serve-static-core/index';
// import { session } from './../node_modules/@types/express-session/index';
import { Query } from '../src/functions/queries'

interface Alarm {
  user_uuid: string;
  awake: string;
  thedate: string;
  title: string;
  active: boolean;
}

interface User {
  email:string;
  uuid:string;
  cart_uuid:string;
  permission:string;
  name:string;
}

interface DB extends Client {
  query:Function;
  release:() => void;
  connect?:Promise<void>;
}

declare global {
    namespace Express {
        interface Request {
          conn:Client;
          user:User;
          querySvc:Query;
          body:Body;
          db:DB;
        }

        interface BaseReqestHandler {
          req:Request;
          res:Response;
        }
        interface Response { }
        interface Application { }

        interface Session {
          user:User,
        }

    }
  namespace AlarmApp {
    interface Inputs {
      email?:string;
      user?:string;
      phone?:string;
      nonce?:string;
      user_uuid?:string;
      newPhone?:string;
      newEmail?:string;
      hashedPassword?:string;
      password?:string;
      thetime?:string;
      awake?:string;
      thedate?:string;
      title?:string;
      permission?:string;
    }
  }
}

interface Body {
  newEmail:Inputs;
  email:Inputs;
  phone:Inputs;
  password:string;
}

interface ModResponse extends Response {
  render(view: string, options?: Object, callback?: (err: Error, html: string) => void): void;
  render(view: string, callback?: (err: Error, html: string) => void): void;
}

interface ModHandlerParams extends RequestHandler {
  name: [()=> any, void]
}

export interface PGOutput {
  rows:Inputs[];
  rowCount:number;
}

export interface Inputs {
  email?:string;
  user?:string;
  phone?:string;
  nonce?:string;
  user_uuid?:string;
  newPhone?:string;
  newEmail?:string;
  hashedPassword?:string;
  password?:string;
  thetime?:string;
  awake?:string;
  thedate?:string;
  title?:string;
  permission?:string;
}

export interface Outputs {
  nonce?:string;
  thetime?:string;
  id?:string;
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.json" {
  const value: any;
  export default value;
}
