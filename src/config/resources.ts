// import * as isUUID from 'is-uuid';
// import { simpleScorer } from '../functions/password-strength'
//
// // ADDITIONAL VALIDATION
// // credit card
// // timestamp?
// // sessionid
//
// class UserException {
//   message:string;
//   name:string;
//
//   constructor(name:string, message:string) {
//     this.message = message;
//     this.name = name.toUpperCase();
//   }
// }
//
// interface ValidationResult {
//   readonly isOkay : boolean;
// }
//
// class ValidationError extends Error implements ValidationResult {
//   readonly name: string;
//   constructor(name: string, message: string) {
//     super(message);
//     Error.captureStackTrace(this); // will creae a stack trace.
//     this.name = name;
//   }
//   get isOkay() { return false; }
//
//   toJSON() {
//     return {
//       error: this.name,
//       ...
//     }
//   }
// }
//
// class Email {
//   private _value:string;
//
//   private constructor(value:string) {
//     this._value = value;
//   }
//
//   valueOf() : string {
//     return this._value;
//   }
//
//   toString() : string {
//     return this._value;
//   }
//
//   toJSON() : string {
//     return this._value;
//   }
//
//   static fromJSON(value : string) : Email {
//     return Email.create(value);
//   }
//
//   static create(value : string) : Email {
//     let res = Email.validate(value);
//     if (!res.isOkay)
//       throw res;
//     return new Email(value);
//   }
//
//   static validate(email:string) : ValidationResult {
//     let re = /^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$/;
//     // if we are not returning the string value, we just need to return the validation result. which either is an error result or okay result.
//
//     if (re.test(email)) {
//       return { isOkay: true };
//     } else {
//       return new ValidationError('invalid type', 'This value -- ' + email + ' -- is not an email.')
//     }
//   }
// }
//
// class UUID {
//   _value:UUID;
//   constructor(value:string) {
//     this._value = UUID.validate(value)
//   }
//
//   static validate(UUID:string):UUID {
//     if (isUUID.v4(UUID)) {
//       return(UUID)
//     } else {
//       throw new UserException('invalid type', 'This value -- ' + UUID + ' -- is not a uuid.')
//     }
//   }
// }
//
// class Permission {
//   _value:Permission;
//   constructor(value:string) {
//     this._value = Permission.validate(value)
//   }
//
//   static validate(permission:string):Permission {
//     let re = /^(guest)$|^(user)$|^(admin)$/
//     if (re.test(permission)) {
//       return permission;
//     } else {
//       throw new UserException('invalid type', 'This value -- ' + permission + ' -- is not a permission.')
//     }
//   }
// }
//
// class ID {
//   _value:ID;
//   constructor(value:number) {
//     this._value = ID.validate(value)
//   }
//
//   static validate(id:number):ID {
//     if (typeof id === 'number') {
//       return id;
//     } else {
//       throw new UserException('invalid type', 'This value -- ' + ID + ' -- is not an ID.')
//     }
//   }
// }
//
// class Number {
//   _value:Number;
//   constructor(value:number) {
//     this._value = Number.validate(value)
//   }
//
//   static validate(number:number):Number {
//     if (typeof number === 'number') {
//       return number;
//     } else {
//       throw new UserException('invalid type', 'This value -- ' + Number + ' -- is not an Number.')
//     }
//   }
// }
//
// class Password {
//   _value:Password;
//   constructor(value:string) {
//     this._value = Password.validate(value)
//   }
//
//   static validate(password:string):Password {
//     if(simpleScorer(password) > 59) {
//       return password;
//     } else {
//       throw new UserException('weak password', 'This value -- ' + Number + ' -- is not a strong enough password.')
//     }
//   }
// }
//
//
// class Name {
//   _value:Name;
//   constructor(value:string) {
//     this._value = Name.validate(value)
//   }
//
//   static validate(name:string):Name {
//     let re = /^([a-zA-Z]{1,15})( [a-zA-Z]{1,15})?([ -]?[a-zA-Z]{1,15})?$/
//     if (re.test(name)) {
//       return name;
//     } else {
//       throw new UserException('invalid type', 'This value -- ' + name + ' -- is not a name.')
//     }
//   }
// }
//
//
// class UserSession {
//   readonly email: Email;
//   readonly uuid: UUID;
//   readonly cart_uuid: UUID;
//   readonly permission: Permission;
//   private constructor() {
//
//   }
//
//   static create(args:{
//     email?:Email;
//     uuid?:UUID;
//     cart_uuid?:UUID;
//     permission?:Permission;
//   } = {}) {
//     // all hese objects already validatted
//     if (!args.email)
//       throw new Error(); // whatever error you want to throw.
//     if (!args.uuid) // ...
//     // ...
//     return new UserSession(...);
//   }
//
//   static fromJSON(args: {[key: string]: any}) : UserSession {
//     let res = UserSession.validate(args);
//     if (res.isOkay) {
//       return create({ email: Email.create(args.email),
//         uuid : UUID.create(args.uuid),
//         ...
//       });
//     } else {
//       throw res;
//     }
//   }
//
//   static validate(args: {[key: string] : any}) : ValidationResult {
//     if (args.hasOwnProperty('email')) {
//       let res = Email.validate(args.email);
//       if (!res.isOkay)
//         return res;
//     }
//     // ...
//     return { isOkay: true };
//   }
//
//   static toJSON() : any {
//     return {
//       email: this.email.toJSON(),
//       uuid : this.uuid.toJSON(),
//       ...
//     };
//   }
// }
//
//
// db.query('select * from some table')
//   .then((records) => {
//
//     //return records.map((rec) => UserSession.fromJSON(rec));
//     return UserSession.fromJSON(records[0]); // need to ensure there is only 1 rec.
//   })
//   .then((userSession) => {
//     return res.json(userSession);
//   })
//   .catch((e) => {
//     return res.json(e);
//   })
//
// class UserDB {
//   id?:Number;
//   user_uuid?:UUID;
//   email?:Number;
//   phone?:Number;
//   password?:Password;
//   name?:Name | null;
//   permission?:Permission;
//
//   static create(userDB:{
//     id?:Number;
//     user_uuid?:UUID;
//     email?:Number;
//     phone?:Number;
//     password?:Password;
//     name?:Name | null;
//     permission?:Permission;
//   } = {}) {
//     let output:UserDB = {};
//
//     for (let k in userSession) {
//       if (k === 'id' ||
//           k === 'user_uuid' ||
//           k === 'email' ||
//           k === 'phone' ||
//           k === 'password' ||
//           k === 'name' ||
//           k === 'permission'
//         ) {
//             output.id         = userDB.id._value;
//             output.user_uuid  = userDB.user_uuid._value;
//             output.email      = userDB.email._value;
//             output.phone      = userDB.phone._value;
//             output.password   = userDB.password._value;
//             output.name       = userDB.name._value;
//             output.permission = userDB.permission._value;
//           } else {
//             throw new UserException('Unknown property present on object', 'userDB should not contain property ' + k)
//           }
//     }
//     return output;
//   }
// }
//
// class CartDB {
//   id?:ID;
//   user_uuid?:UUID;
//   cart_uuid?:UUID;
//   card_number?:string;
//
//   static create(cartDB: {
//     id?:ID;
//     user_uuid?:UUID;
//     cart_uuid?:UUID;
//     card_number?:string;
// } = {}) {
//   let output:CartDB = {};
//
//   for (let k in cartDB) {
//       if (k === 'id' ||
//       k === 'user_uuid' ||
//       k === 'cart_uuid' ||
//       k === 'card_number')
//       {
//         output.id          = cartDB.id._value;
//         output.user_uuid   = cartDB.user_uuid._value;
//         output.cart_uuid   = cartDB.cart_uuid._value;
//         output.card_number = cartDB.card_number._value;
//       } else {
//         throw new UserException('Unknown property present on object', 'cartDB should not contain property ' + k)
//       }
//     }
//     return output;
//   }
// }
//
// class OrderDB {
//   id?:ID;
//   user_uuid?:UUID;
//   order_id?:UUID;
//   order_uuid?:UUID;
//   card_number?:string;
//   order_number?:Number;
//
//   static create(orderDB: {
//     id?:ID;
//     user_uuid?:UUID;
//     order_id?:UUID;
//     order_uuid?:UUID;
//     card_number?:string;
//     order_number?:Number;
//   } = {}) {
//   let output:OrderDB = {};
//
//   for (let k in orderDB) {
//       if (k === 'id' ||
//       k === 'user_uuid' ||
//       k === 'order_id' ||
//       k === 'order_uuid' ||
//       k === 'card_number' ||
//       k === 'order_number')
//       {
//         output.id           = orderDB.id._value;
//         output.user_uuid    = orderDB.user_uuid._value;
//         output.order_id     = orderDB.order_id._value;
//         output.order_uuid   = orderDB.order_uuid._value;
//         output.card_number  = orderDB.card_number._value;
//         output.order_number = orderDB.order_number._value;
//       } else {
//         throw new UserException('Unknown property present on object', 'orderDB should not contain property ' + k)
//       }
//     }
//     return output;
//   }
// }
//
//
// class SessionDB {
//   user_uuid?:UUID;
//   sessionid?:string;
//
//   static create(sessionDB: {
//     user_uuid?:UUID;
//     sessionid?:string;
//   } = {}) {
//   let output:SessionDB = {};
//
//   for (let k in sessionDB) {
//       if (k === 'id' ||
//       k === 'order_number')
//       {
//         output.user_uuid = sessionDB.user_uuid._value;
//         output.sessionid = sessionDB.sessionid._value;
//       } else {
//         throw new UserException('Unknown property present on object', 'sessionDB should not contain property ' + k)
//       }
//     }
//     return output;
//   }
// }
//
// export { UserDB, OrderDB, SessionDB, UserSession, CartDB }
