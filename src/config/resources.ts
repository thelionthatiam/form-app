class User {
  email:string;
  uuid:string;
  cart_uuid:string;
  permission:string;

  constructor(userSession:User) {
    this.email      = userSession.email;
    this.uuid       = userSession.uuid;
    this.cart_uuid  = userSession.cart_uuid;
    this.permission = userSession.permission;
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

export { UserDB, OrderDB, SessionDB}
