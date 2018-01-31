import { Inputs } from '../../typings/typings';
import { Client } from '../../node_modules/@types/pg/index'
import * as r from '../config/resources';

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

  selectOrder(values:string[]) {
    const query = "SELECT * FROM orders WHERE user_uuid = $1"
    return this.conn.query(query, values);
  }

  selectCart(values:string[]) {
    const query = 'SELECT cart_uuid FROM cart WHERE user_uuid = $1'
    return this.conn.query(query, values);
  }

  updateSessionID(values:string[]) {
    const query = 'UPDATE session SET sessionid = $1 WHERE user_uuid = $2';
    return this.conn.query(query, values);
  }

//   selectRowViaEmail(inputs:Inputs, cb:Function) {
//     const query = "SELECT * FROM users WHERE email = $1";
//     const values = [inputs.email];
//     console.log(values)
//     return this.conn.query(query, values, function(err, result) {
//       if (err) {
//         cb(err); // u
//       } else {
//         console.log('selectRowViaEmail');
//         cb(null, result);
//       }
//     });
//   };
//
//   selectAlarmViaUUID(inputs:Inputs, cb:Function) {
//     const query = "SELECT * FROM alarms WHERE user_uuid = $1";
//     const values = [inputs.user_uuid];
//
//     return this.conn.query(query, values, function(err, result) {
//       if (err) {
//         cb(err); // u
//       } else {
//         console.log('selectRowViaEmail');
//         cb(null, result);
//       }
//     });
//   };
//
//
//   selectNonceAndTimeViaUID(inputs:Inputs, cb:Function) {
//     const query = 'SELECT nonce, theTime FROM nonce WHERE user_uuid = $1';
//     const values = [inputs.user_uuid];
//
//     return this.conn.query(query, values, function(err:Error, result:string) {
//       if (err) {
//         cb(err);
//       } else {
//         console.log('selectNonceAndTimeViaUID');
//         cb(null, result);
//       }
//     });
//   };
//
//   selectSessionUser = function (inputs:Inputs, cb:Function) {
//     const query = 'SELECT * FROM users WHERE email = $1 AND password = $2 and phone = $3';
//     const values = [inputs.email, inputs.password, inputs.phone]
//
//     return this.conn.query(query, values, function(err:Error, result:string) {
//       if (err) {
//         cb(err);
//       } else {
//         cb(null, result)
//       }
//     })
//   }
//
//   insertNewUser = function (inputs:Inputs, cb:Function) {
//     const query = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';
//     const values = [inputs.email, inputs.phone, inputs.password];
//
//     return this.conn.query(query, values, function(err:Error, result:string) {
//       if (err) {
//         cb(err);
//       } else {
//         console.log('insertNewUser');
//         cb(null, result);
//       }
//     });
//   };
//
//   insertNewNonce = function (inputs:Inputs, cb:Function) {
//     const query = 'INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2) RETURNING *';
//     const values = [inputs.user_uuid, inputs.nonce];
//
//     return this.conn.query(query, values, function(err:Error, result:string) {
//       if (err) {
//         cb(err);
//       } else {
//         console.log('insertNewNonce');
//         cb(null, result);
//       }
//     });
//   };
//
//   updateNonce = function (inputs:Inputs, cb:Function) {
//   const query = "UPDATE nonce SET nonce = $1, theTime = default WHERE user_uuid = $2";
//   const values = [inputs.nonce, inputs.user_uuid];
//
//     return this.conn.query(query, values, function(err:Error, result:string) {
//       if (err) {
//         cb(err);
//       } else {
//         console.log('updateNonce');
//         cb(null, result);
//       }
//     });
//   };
//
//   updateEmail = function (inputs:Inputs, cb:Function) {
//     const query = "UPDATE users SET email = $1 WHERE email = $2";
//     const values = [inputs.newEmail, inputs.email];
//
//     return this.conn.query(query, values, function(err:Error, result:string) {
//       if (err) {
//         cb(err);
//       } else {
//         console.log('updateEmail');
//         cb(null, result);
//       }
//     });
//   };
//
//   updatePhone = function (inputs:Inputs, cb:Function) {
//     const query = "UPDATE users SET phone = $1 WHERE email = $2";
//     const values = [inputs.newPhone, inputs.email];
//
//     return this.conn.query(query, values, function(err:Error, result:string) {
//       if (err) {
//         cb(err);
//       } else {
//         console.log('updatePhone');
//         cb(null, result);
//       }
//     });
//   };
//
//   updatePassword = function (inputs:Inputs, cb:Function) {
//     const query = "UPDATE users SET password = $1 WHERE user_uuid = $2";
//     const values = [inputs.hashedPassword, inputs.user_uuid];
//
//     return this.conn.query(query, values, function(err:Error, result:string) {
//       if (err) {
//         cb(err);
//       } else {
//         console.log('update password')
//         cb(null, result);
//       }
//     });
//   };
//
//   removeUserViaEmail = function (inputs:Inputs, cb:Function) {
//     const query = "DELETE FROM users WHERE email = $1";
//     const values = [inputs.email];
//
//     return this.conn.query(query, values, function (err:Error, result:string) {
//       if (err) {
//         cb(err); // u
//       } else {
//         cb(null, result);
//       }
//     });
//   };
// }
//
//
// // is open to many query/values doesn't descriminate
// Query.prototype.selectRowViaEmail = function (inputs:Inputs, cb:Function) {
//   const query = "SELECT * FROM users WHERE email = $1";
//   const values = [inputs.email];
//
//   return this.conn.query(query, values, function(err:Error, result:string) {
//     if (err) {
//       cb(err); // u
//     } else {
//       console.log('selectRowViaEmail');
//       cb(null, result);
//     }
//   });
// };
//
//
// // select a nonce row from UUID
// Query.prototype.selectNonceAndTimeViaUID = function (inputs:Inputs, cb:Function) {
//   const query = 'SELECT nonce, theTime FROM nonce WHERE user_uuid = $1';
//   const values = [inputs.user_uuid];
//
//   return this.conn.query(query, values, function(err:Error, result:string) {
//     if (err) {
//       cb(err);
//     } else {
//       console.log('selectNonceAndTimeViaUID');
//       cb(null, result);
//     }
//   });
// };
//
// Query.prototype.selectSessionUser = function (inputs:Inputs, cb:Function) {
//   const query = 'SELECT * FROM users WHERE email = $1 AND password = $2 and phone = $3';
//   const values = inputs;
//
//   return this.conn.query(query, values, function(err:Error, result:string) {
//     if (err) {
//       cb(err);
//     } else {
//       cb(null, result)
//     }
//   })
// }
//
// //insert into users from inputs
// Query.prototype.insertNewUser = function (inputs:Inputs, cb:Function) {
//   const query = 'INSERT INTO users(email, phone, password) VALUES($1, $2, $3) RETURNING *';
//   const values = [inputs.email, inputs.phone, inputs.password];
//
//   return this.conn.query(query, values, function(err:Error, result:string) {
//     if (err) {
//       cb(err);
//     } else {
//       console.log('insertNewUser');
//       cb(null, result);
//     }
//   });
// };
//
//
// // insert into nonce from user_uuid
// // nonce failed
// Query.prototype.insertNewNonce = function (inputs:Inputs, cb:Function) {
//   const query = 'INSERT INTO nonce(user_uuid, nonce) VALUES ($1, $2) RETURNING *';
//   const values = [inputs.user_uuid, inputs.nonce];
//
//   return this.conn.query(query, values, function(err:Error, result:string) {
//     if (err) {
//       cb(err);
//     } else {
//       console.log('insertNewNonce');
//       cb(null, result);
//     }
//   });
// };
//
//
// // update nonce via user uuid
// Query.prototype.updateNonce = function (inputs:Inputs, cb:Function) {
// const query = "UPDATE nonce SET nonce = $1, theTime = default WHERE user_uuid = $2";
// const values = [inputs.nonce, inputs.user_uuid];
//
//   return this.conn.query(query, values, function(err:Error, result:string) {
//     if (err) {
//       cb(err);
//     } else {
//       console.log('updateNonce');
//       cb(null, result);
//     }
//   });
// };
//
//
// // update email
// Query.prototype.updateEmail = function (inputs:Inputs, cb:Function) {
//   const query = "UPDATE users SET email = $1 WHERE email = $2";
//   const values = [inputs.newEmail, inputs.email];
//
//   return this.conn.query(query, values, function(err:Error, result:string) {
//     if (err) {
//       cb(err);
//     } else {
//       console.log('updateEmail');
//       cb(null, result);
//     }
//   });
// };
//
//
// // update phone
// Query.prototype.updatePhone = function (inputs:Inputs, cb:Function) {
//   const query = "UPDATE users SET phone = $1 WHERE email = $2";
//   const values = [inputs.newPhone, inputs.email];
//
//   return this.conn.query(query, values, function(err:Error, result:string) {
//     if (err) {
//       cb(err);
//     } else {
//       console.log('updatePhone');
//       cb(null, result);
//     }
//   });
// };
//
//
// // update password
// Query.prototype.updatePassword = function (inputs:Inputs, cb:Function) {
//   const query = "UPDATE users SET password = $1 WHERE user_uuid = $2";
//   const values = [inputs.hashedPassword, inputs.user_uuid];
//
//   return this.conn.query(query, values, function(err:Error, result:string) {
//     if (err) {
//       cb(err);
//     } else {
//       console.log('update password')
//       cb(null, result);
//     }
//   });
// };
//
//
// //remove row through email ERR NOT COVERED
// Query.prototype.removeUserViaEmail = function (inputs:Inputs, cb:Function) {
//   const query = "DELETE FROM users WHERE email = $1";
//   const values = [inputs.email];
//
//   return this.conn.query(query, values, function (err:Error, result:string) {
//     if (err) {
//       cb(err); // u
//     } else {
//       cb(null, result);
//     }
//   });
};
//

export { Query };
