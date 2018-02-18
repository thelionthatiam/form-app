// import * as isUUID from 'is-uuid';
// import { simpleScorer } from '../functions/password-strength'
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
//   message: string;
//
//   constructor(name: string, message:string) {
//     super(message);
//     Error.captureStackTrace(this); // will creae a stack trace.
//     this.message = message
//     this.name = name;
//   }
//
//   get isOkay() { return false; }
//
//   toJSON() {
//     return {
//       name: this.name,
//       message: this.message
//     }
//   }
// }
//
// class ValueScalar {
//   private _value:string;
//   constructor(value:string) {
//     this._value = value;
//   }
//   valueOf() : string {
//     return this._value;
//   }
//   toString() : string {
//     return this._value;
//   }
//   toJSON() : string {
//     return this._value;
//   }
// }
//
// class Email extends ValueScalar {
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
//     if (re.test(email)) {
//       return { isOkay: true };
//     } else {
//       return new ValidationError('invalid type', 'This value -- ' + email + ' -- is not an email.')
//     }
//   }
// }
//
// class Permission extends ValueScalar {
//   static fromJSON(value : string) : Permission {
//     return Permission.create(value);
//   }
//
//   static create(value : string) : Permission {
//     let res = Permission.validate(value);
//     if (!res.isOkay)
//       throw res;
//     return new Permission(value);
//   }
//
//   static validate(permission:string) : ValidationResult {
//     let re = /^(guest)$|^(user)$|^(admin)$/
//     if (re.test(permission)) {
//       return { isOkay: true };
//     } else {
//       throw new ValidationError('invalid type', 'This value -- ' + permission + ' -- is not a permission.')
//     }
//   }
// }
//
// class CharOnly  extends ValueScalar {
//   static fromJSON(value : string) : CharOnly {
//     return CharOnly.create(value);
//   }
//
//   static create(value : string) : CharOnly {
//     let res = CharOnly.validate(value);
//     if (!res.isOkay)
//       throw res;
//     return new CharOnly(value);
//   }
//
//   static validate(charOnly:string) : ValidationResult {
//     let re = /^[a-zA-Z ]+$/
//       if (re.test(charOnly)) {
//         return { isOkay: true };
//       } else {
//         throw new ValidationError('invalid type', 'This value -- ' + charOnly + ' -- is not only chars.')
//       }
//   }
// }
//
// class NumOnly extends ValueScalar {
//   static fromJSON(value : string) : NumOnly {
//     return NumOnly.create(value);
//   }
//
//   static create(value : string) : NumOnly {
//     let res = NumOnly.validate(value);
//     if (!res.isOkay)
//       throw res;
//     return new NumOnly(value);
//   }
//
//   static validate(numOnly:string) : ValidationResult {
//     let re = /^[0-9]+$/
//       if (re.test(numOnly)) {
//         return { isOkay: true };
//       } else {
//         throw new ValidationError('invalid type', 'This value -- ' + numOnly + ' -- is not only numbers.')
//       }
//   }
// }
//
// class UUID extends ValueScalar {
//   static fromJSON(value : string) : UUID {
//     return UUID.create(value);
//   }
//
//   static create(value : string) : UUID {
//     let res = UUID.validate(value);
//     if (!res.isOkay)
//       throw res;
//     return new UUID(value);
//   }
//
//   static validate(uuid:string) : ValidationResult {
//     if (isUUID.v4(uuid)) {
//       return { isOkay: true };
//     } else {
//       return new ValidationError('invalid type', 'This value -- ' + uuid + ' -- is not a uuid.')
//     }
//   }
// }
//
// // THIS COULD LIVE SOMEWHERE ELSE
// class ValueObject {
//   static isValid(args:any, obj:any) {
//     for (let k in obj) {
//       if (args.hasOwnProperty(k)) {
//         let res = obj[k]
//         if (!res.isOkay)
//           return res;
//       } else {
//         let message = 'MISSING PROPERTY: ' + k;
//         throw new ValidationError(null, message);
//       }
//     }
//   }
// }
//
//
// class UserSession {
//   readonly      email?: Email;
//   readonly       uuid?: UUID;
//   readonly permission?: Permission;
//   readonly  cart_uuid?: UUID;
//   readonly       name?: CharOnly | null;
//
//   private constructor(args:{ email?: Email; uuid?: UUID; permission?: Permission; cart_uuid?: UUID; name?: CharOnly | null; } = {}) {
//     this.email      = args.email;
//     this.uuid       = args.uuid;
//     this.cart_uuid  = args.cart_uuid;
//     this.permission = args.permission;
//     this.name       = args.name;
//   }
//
//   static fromJSON(args: {[key: string]: any}) : UserSession {
//     let res = UserSession.validate(args);
//     if (res.isOkay) {
//       let res = new UserSession({
//         email: Email.create(args.email),
//         uuid : UUID.create(args.uuid),
//         permission: Permission.create(args.permission),
//         cart_uuid: UUID.create(args.cart_uuid),
//         name: CharOnly.create(args.name),
//       })
//       return res.toJSON();
//     } else {
//       throw new Error ('error happens at fromJSON');
//     }
//   }
//
//   static validate(args: {[key: string] : any}) : ValidationResult {
//     let propValidation = {
//       email: Email.validate(args.email),
//       uuid: UUID.validate(args.uuid),
//       permission: Permission.validate(args.permission),
//       cart_uuid: UUID.validate(args.cart_uuid),
//       name: CharOnly.validate(args.name),
//     }
//     ValueObject.isValid(args, propValidation)
//     return { isOkay: true };
//   }
//
//   toJSON() : any {
//     return {
//       email: this.email.toString(),
//       uuid: this.uuid.toString(),
//       permission: this.permission.toString(),
//       cart_uuid: this.cart_uuid.toString(),
//       name: this.name.toString()
//     };
//   }
// }
//
// // class User {
// //   readonly email?: Email;
// //   readonly permission?: Permission;
// //   readonly user_uuid?: UUID;
// //   readonly name?: CharOnly | null;
// //   readonly phone?: NumOnly;
// //
// //
// //   private constructor(args:{ email?: Email; permission?: Permission; user_uuid?: UUID; name?: CharOnly | null; phone?: NumOnly; } = {}) {
// //     this.email = args.email;
// //     this.phone = args.phone;
// //     this.user_uuid = args.user_uuid;
// //     this.permission = args.permission;
// //     this.name = args.name;
// //   }
// //
// //   static create(args:{ email?: Email; permission?: Permission; user_uuid?: UUID; name?: CharOnly | null; phone?: NumOnly;} = {}) {
// //     if (!args.email)
// //       throw new Error('Missing email');
// //     if (!args.permission)
// //       throw new Error('Missing permission');
// //     if (!args.user_uuid)
// //       throw new Error('Missing user_uuid');
// //     if (!args.name)
// //     if (!args.phone)
// //       throw new Error('Missing phone');
// //
// //     let res = new User(args);
// //     return res.toJSON();
// //   }
// //
// //   static fromJSON(args: {[key: string]: any}) : User {
// //     let res = User.validate(args);
// //     if (res.isOkay) {
// //       return User.create({
// //         email: Email.create(args.email),
// //         permission: Permission.create(args.permission),
// //         user_uuid: UUID.create(args.user_uuid),
// //         name: CharOnly.create(args.name),
// //         phone: NumOnly.create(args.phone)
// //       });
// //     } else {
// //       throw res;
// //     }
// //   }
// //
// //   static validate(args: {[key: string] : any}) : ValidationResult {
// //     if (args.hasOwnProperty('email')) {
// //       let res = Email.validate(args.email);
// //       if (!res.isOkay)
// //         return res;
// //     }
// //     if (args.hasOwnProperty('permission')) {
// //       let res = Permission.validate(args.permission);
// //       if (!res.isOkay)
// //         return res;
// //     }
// //     if (args.hasOwnProperty('user_uuid')) {
// //       let res = UUID.validate(args.user_uuid);
// //       if (!res.isOkay)
// //         return res;
// //     }
// //     if (args.hasOwnProperty('name')) {
// //       let res = CharOnly.validate(args.name);
// //       if (!res.isOkay)
// //         return res;
// //     }
// //     if (args.hasOwnProperty('phone')) {
// //       let res = NumOnly.validate(args.phone);
// //       if (!res.isOkay)
// //         return res;
// //     }
// //     return { isOkay: true };
// //   }
// //
// //   toJSON() : any {
// //     if (!this.name) {
// //       return {
// //         email: this.email.toString(),
// //         permission: this.permission.toString(),
// //         user_uuid: this.user_uuid.toString(),
// //         phone: this.phone.toString()
// //       };
// //     } else {
// //       return {
// //         email: this.email.toString(),
// //         permission: this.permission.toString(),
// //         user_uuid: this.user_uuid.toString(),
// //         name: this.name.toString(),
// //         phone: this.phone.toString()
// //       };
// //     }
// //
// //   }
// // }
//
//
// // EXAMPLE USE
// // db.query('select * from some table')
// //   .then((records) => {
// //
// //     //return records.map((rec) => UserSession.fromJSON(rec));
// //     return UserSession.fromJSON(records[0]); // need to ensure there is only 1 rec.
// //   })
// //   .then((userSession) => {
// //     return res.json(userSession);
// //   })
// //   .catch((e) => {
// //     return res.json(e);
// //   })
//
// // class UserDB {
// //   id?:Number;
// //   user_uuid?:UUID;
// //   email?:Number;
// //   phone?:Number;
// //   password?:Password;
// //   name?:Name | null;
// //   permission?:Permission;
// //
// // }
// //
// // class CartDB {
// //   id?:ID;
// //   user_uuid?:UUID;
// //   cart_uuid?:UUID;
// //   card_number?:string;
// //
// // }
// //
// // class OrderDB {
// //   id?:ID;
// //   user_uuid?:UUID;
// //   order_id?:UUID;
// //   order_uuid?:UUID;
// //   card_number?:string;
// //   order_number?:Number;
// // }
// //
// //
// // class SessionDB {
// //   user_uuid?:UUID;
// //   sessionid?:string;
// // }
// //
// //
// // class Permission {
// //   _value:Permission;
// //   constructor(value:string) {
// //     this._value = Permission.validate(value)
// //   }
// //
// //   static validate(permission:string):Permission {
// //     let re = /^(guest)$|^(user)$|^(admin)$/
// //     if (re.test(permission)) {
// //       return permission;
// //     } else {
// //       throw new UserException('invalid type', 'This value -- ' + permission + ' -- is not a permission.')
// //     }
// //   }
// // }
// //
// // class ID {
// //   _value:ID;
// //   constructor(value:number) {
// //     this._value = ID.validate(value)
// //   }
// //
// //   static validate(id:number):ID {
// //     if (typeof id === 'number') {
// //       return id;
// //     } else {
// //       throw new UserException('invalid type', 'This value -- ' + ID + ' -- is not an ID.')
// //     }
// //   }
// // }
// //
// // class Number {
// //   _value:Number;
// //   constructor(value:number) {
// //     this._value = Number.validate(value)
// //   }
// //
// //   static validate(number:number):Number {
// //     if (typeof number === 'number') {
// //       return number;
// //     } else {
// //       throw new UserException('invalid type', 'This value -- ' + Number + ' -- is not an Number.')
// //     }
// //   }
// // }
// //
// // class Password {
// //   _value:Password;
// //   constructor(value:string) {
// //     this._value = Password.validate(value)
// //   }
// //
// //   static validate(password:string):Password {
// //     if(simpleScorer(password) > 59) {
// //       return password;
// //     } else {
// //       throw new UserException('weak password', 'This value -- ' + Number + ' -- is not a strong enough password.')
// //     }
// //   }
// // }
// //
// //
//
// let testObj = {
//   name: 'joe',
//   email: 'a@a.aa',
//   permission: 'user',
//   uuid: 'b1250b28-a43e-4263-9695-1b9618d65f3d',
//   cart_uuid: 'b1250b28-a43e-4263-9695-1b9618d65f3d',
// }
//
// let res = UserSession.fromJSON(testObj);
//
// console.log(res);
//
//
// export { User }
//# sourceMappingURL=resources.js.map