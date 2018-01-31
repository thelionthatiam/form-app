class V4UUID {
  uuid:v4uuid;

  constructor(uuid:v4uuid) {
    this.uuid = validUUID(uuid);
  }
  
  validUUID(uuid:v4uuid) {
    // a check
  }
}

class UserDB {
  id:number;
  user_id:number;
  user_uuid:string; // how to access V4UUID class information?
  email:string;
  phone:string;
  password:string;
  name:string|null;
  permission:string;

  constructor(userQueryResult:UserDB) {
    this.user_id    = userQueryResult.id;
    this.user_uuid  = userQueryResult.user_uuid; // how to access V4UUID class information?
    this.phone      = userQueryResult.phone;
    this.password   = userQueryResult.password;
    this.name       = userQueryResult.name;
    this.permission = userQueryResult.permission;
    this.email      = userQueryResult.email;
  }
}
