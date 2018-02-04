import * as isUUID from 'is-uuid';
import { simpleScorer } from '../functions/password-strength'

// ADDITIONAL VALIDATION
// credit card
// timestamp?
// sessionid

class UserException {
  message:string;
  name:string;

  constructor(name:string, message:string) {
    this.message = message;
    this.name = name.toUpperCase();
  }
}



class Email {
  _value:Email;
  constructor(value:string) {
    this._value = Email.validate(value);
  }
  static validate(email:string):Email {
    let re = /^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$/;
    if (re.test(email)) {
      return email;
    } else {
      throw new UserException('invalid type', 'This value -- ' + email + ' -- is not an email.')
    }
  }
}

class UUID {
  _value:UUID;
  constructor(value:string) {
    this._value = UUID.validate(value)
  }

  static validate(UUID:string):UUID {
    if (isUUID.v4(UUID)) {
      return(UUID)
    } else {
      throw new UserException('invalid type', 'This value -- ' + UUID + ' -- is not a uuid.')
    }
  }
}

class Permission {
  _value:Permission;
  constructor(value:string) {
    this._value = Permission.validate(value)
  }

  static validate(permission:string):Permission {
    let re = /^(guest)$|^(user)$|^(admin)$/
    if (re.test(permission)) {
      return permission;
    } else {
      throw new UserException('invalid type', 'This value -- ' + permission + ' -- is not a permission.')
    }
  }
}

class ID {
  _value:ID;
  constructor(value:number) {
    this._value = ID.validate(value)
  }

  static validate(id:number):ID {
    if (typeof id === 'number') {
      return id;
    } else {
      throw new UserException('invalid type', 'This value -- ' + ID + ' -- is not an ID.')
    }
  }
}

class Number {
  _value:Number;
  constructor(value:number) {
    this._value = Number.validate(value)
  }

  static validate(number:number):Number {
    if (typeof number === 'number') {
      return number;
    } else {
      throw new UserException('invalid type', 'This value -- ' + Number + ' -- is not an Number.')
    }
  }
}

class Password {
  _value:Password;
  constructor(value:string) {
    this._value = Password.validate(value)
  }

  static validate(password:string):Password {
    if(simpleScorer(password) > 59) {
      return password;
    } else {
      throw new UserException('weak password', 'This value -- ' + Number + ' -- is not a strong enough password.')
    }
  }
}


class Name {
  _value:Name;
  constructor(value:string) {
    this._value = Name.validate(value)
  }

  static validate(name:string):Name {
    let re = /^([a-zA-Z]{1,15})( [a-zA-Z]{1,15})?([ -]?[a-zA-Z]{1,15})?$/
    if (re.test(name)) {
      return name;
    } else {
      throw new UserException('invalid type', 'This value -- ' + name + ' -- is not a name.')
    }
  }
}


class UserSession {
  email?:Email;
  uuid?:UUID;
  cart_uuid?:UUID;
  permission?:Permission;

  static create(userSession:{
    email?:Email;
    uuid?:UUID;
    cart_uuid?:UUID;
    permission?:Permission;
  } = {}) {
    let output:UserSession = {};

    for (let k in userSession) {
      if (k === 'email' ||
          k === 'permission' ||
          k === 'uuid' ||
          k === 'cart_uuid') {
            output.email      = userSession.email._value;
            output.uuid       = userSession.uuid._value;
            output.cart_uuid  = userSession.cart_uuid._value;
            output.permission = userSession.permission._value;
          } else {
            throw new UserException('Unknown property present on object', 'userSession should not contain property ' + k)
          }
    }
    return output;
  }
}

class UserDB {
  id?:Number;
  user_uuid?:UUID;
  email?:Number;
  phone?:Number;
  password?:Password;
  name?:Name | null;
  permission?:Permission;

  static create(userDB:{
    id?:Number;
    user_uuid?:UUID;
    email?:Number;
    phone?:Number;
    password?:Password;
    name?:Name | null;
    permission?:Permission;
  } = {}) {
    let output:UserDB = {};

    for (let k in userSession) {
      if (k === 'id' ||
          k === 'user_uuid' ||
          k === 'email' ||
          k === 'phone' ||
          k === 'password' ||
          k === 'name' ||
          k === 'permission'
        ) {
            output.id         = userDB.id._value;
            output.user_uuid  = userDB.user_uuid._value;
            output.email      = userDB.email._value;
            output.phone      = userDB.phone._value;
            output.password   = userDB.password._value;
            output.name       = userDB.name._value;
            output.permission = userDB.permission._value;
          } else {
            throw new UserException('Unknown property present on object', 'userDB should not contain property ' + k)
          }
    }
    return output;
  }
}

class CartDB {
  id?:ID;
  user_uuid?:UUID;
  cart_uuid?:UUID;
  card_number?:string;

  static create(cartDB: {
    id?:ID;
    user_uuid?:UUID;
    cart_uuid?:UUID;
    card_number?:string;
} = {}) {
  let output:CartDB = {};

  for (let k in cartDB) {
      if (k === 'id' ||
      k === 'user_uuid' ||
      k === 'cart_uuid' ||
      k === 'card_number')
      {
        output.id          = cartDB.id._value;
        output.user_uuid   = cartDB.user_uuid._value;
        output.cart_uuid   = cartDB.cart_uuid._value;
        output.card_number = cartDB.card_number._value;
      } else {
        throw new UserException('Unknown property present on object', 'cartDB should not contain property ' + k)
      }
    }
    return output;
  }
}

class OrderDB {
  id?:ID;
  user_uuid?:UUID;
  order_id?:UUID;
  order_uuid?:UUID;
  card_number?:string;
  order_number?:Number;

  static create(orderDB: {
    id?:ID;
    user_uuid?:UUID;
    order_id?:UUID;
    order_uuid?:UUID;
    card_number?:string;
    order_number?:Number;
  } = {}) {
  let output:OrderDB = {};

  for (let k in orderDB) {
      if (k === 'id' ||
      k === 'user_uuid' ||
      k === 'order_id' ||
      k === 'order_uuid' ||
      k === 'card_number' ||
      k === 'order_number')
      {
        output.id           = orderDB.id._value;
        output.user_uuid    = orderDB.user_uuid._value;
        output.order_id     = orderDB.order_id._value;
        output.order_uuid   = orderDB.order_uuid._value;
        output.card_number  = orderDB.card_number._value;
        output.order_number = orderDB.order_number._value;
      } else {
        throw new UserException('Unknown property present on object', 'orderDB should not contain property ' + k)
      }
    }
    return output;
  }
}


class SessionDB {
  user_uuid?:UUID;
  sessionid?:string;

  static create(sessionDB: {
    user_uuid?:UUID;
    sessionid?:string;
  } = {}) {
  let output:SessionDB = {};

  for (let k in sessionDB) {
      if (k === 'id' ||
      k === 'order_number')
      {
        output.user_uuid = sessionDB.user_uuid._value;
        output.sessionid = sessionDB.sessionid._value;
      } else {
        throw new UserException('Unknown property present on object', 'sessionDB should not contain property ' + k)
      }
    }
    return output;
  }
}

export { UserDB, OrderDB, SessionDB, UserSession, CartDB }
