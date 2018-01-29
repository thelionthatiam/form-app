import * as isUUID from 'is-uuid';

class Validation {
  emailValid(email:string) {
    let re = /^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$/;
    try {
      if (re.test(email)) {
        return email;
      } else {
        throw new Error('Not a real email.')
      }
    } catch(e) {
      console.log(e);
      // pass failure contition up stream to route and view
      return 'fail';
    }
  }

  uuidValid(uuid:string) {
    try {
      if (isUUID.v4(uuid)) {
        return(uuid)
      } else {
        throw new Error('Not a real uuid.')
      }
    } catch(e) {
      console.log(e);
      // pass failure contition up stream to route and view
      return 'fail';
    }
  }

  permissionValid(permission:string) {
    let re = /(guest)|(user)|(admin)/
    try {
      if (re.test(permission)) {
        return permission;
      } else {
        throw new Error('Not a real permission')
      }
    }  catch(e) {
      console.log(e);
      // pass failure contition up stream to route and view
      return 'fail';
    }
  }
}

class UserSession extends Validation {
  email:string;
  uuid:string;
  cart_uuid:string;
  permission:string;

  constructor(userSession:UserSession) {
    super();
    try {
      this.email      = this.emailValid(userSession.email);
      this.uuid       = this.uuidValid(userSession.uuid);
      this.cart_uuid  = this.uuidValid(userSession.cart_uuid);
      this.permission = this.permissionValid(userSession.permission);
    } catch (e) {
      // report error upstream
    }
  }
}

class UserDB {
  id:number;
  user_id:number;
  user_uuid:string;
  email:string;
  phone:string;
  password:string;
  name:string|null;
  permission:string;

  constructor(userQueryResult:UserDB) {
    this.user_id    = userQueryResult.id;
    this.user_uuid  = userQueryResult.user_uuid;
    this.phone      = userQueryResult.phone;
    this.password   = userQueryResult.password;
    this.name       = userQueryResult.name;
    this.permission = userQueryResult.permission;
    this.email      = userQueryResult.email;
  }
}

class CartDB {
  id:number;
  user_uuid:string;
  cart_uuid:string;
  card_number:string;

  constructor(cartQueryResult:CartDB) {
  this.id          = cartQueryResult.id
  this.user_uuid   = cartQueryResult.user_uuid
  this.cart_uuid   = cartQueryResult.cart_uuid
  this.card_number = cartQueryResult.card_number
  }
}

class OrderDB {
  id:number;
  order_id:number;
  order_uuid:string;
  card_number:string;
  order_number:number;
  user_uuid:string;
  create_timestamp:string;
  udated_timestamp:string;

  constructor(orderQueryResult:OrderDB) {
    this.order_id         = orderQueryResult.id;
    this.order_uuid       = orderQueryResult.order_uuid;
    this.card_number      = orderQueryResult.card_number;
    this.order_number     = orderQueryResult.order_number;
    this.user_uuid        = orderQueryResult.user_uuid;
    this.create_timestamp = orderQueryResult.create_timestamp;
    this.udated_timestamp = orderQueryResult.udated_timestamp;
  }
}


class SessionDB {
  user_uuid:string;
  sessionid:string;

  constructor(sessionQueryResult:SessionDB) {
    this.user_uuid = sessionQueryResult.user_uuid;
    this.sessionid = sessionQueryResult.sessionid;
  }
}

export { UserDB, OrderDB, SessionDB, UserSession}
