import * as isUUID from 'is-uuid';

class Email {
  _value:string;
  constructor(value:string) {
    this._value = Email.validate(value);
  }
  static validate(value:string) {
    let re = /^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$/;
    if (re.test(value)) {
      return value;
    } else {
      throw new Error('Not a real email.')
    }
  }
}

class UUID {
  _value:string;
  constructor(value:string) {
    this._value = UUID.validate(value)
  }

  static validate(UUID:string) {
    if (isUUID.v4(UUID)) {
      return(UUID)
    } else {
      throw new Error('Not a real uuid.')
    }
  }
}

class Permission {
  _value:string;
  constructor(value:string) {
    this._value = Permission.validate(value)
  }

  static validate(permission:string) {
    let re = /(guest)|(user)|(admin)/
    if (re.test(permission)) {
      return permission;
    } else {
      throw new Error('Not a real permission')
    }
  }
}


class UserSession {
  email:Email;
  uuid:UUID;
  cart_uuid:UUID;
  permission:Permission;

  constructor(userSession:{
    email?:Email;
    uuid?:UUID;
    cart_uuid?:UUID;
    permission?:Permission;
  } = {}) {
    this.email      = Email.validate(userSession.email);
    this.uuid       = UUID.validate(userSession.uuid);
    this.cart_uuid  = UUID.validate(userSession.cart_uuid);
    this.permission = Permission.validate(userSession.permission);
  }

  static validate(userSession:UserSession) {
    if (userSession.email && userSession.uuid && userSession.cart_uuid && userSession.permission) {
      return userSession
    } else {
      throw new Error('User session does not have the right properties')
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

export { UserDB, OrderDB, SessionDB, UserSession, CartDB }
