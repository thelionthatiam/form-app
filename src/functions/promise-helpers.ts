import * as bcrypt from 'bcrypt';
import { ModResponse } from '../../typings/typings';

let randomString = new Promise(
  (resolve, reject) => {
    let string = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,.<>/?;:'{}[]|";
    for (let i = 0; i <= 40; i++) {
      string += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (typeof string === "undefined") {
      reject("randomString failed to create anything ")
    }
    resolve(string)
  }
)

let isSessionValid = (token, outputs) => {
  return new Promise(
    (resolve, reject) => {
      let nonce = outputs.nonce
        , oldDate = new Date(outputs.thetime)
        , oldTime = oldDate.getTime()
        , currentDate = new Date()
        , currentTime = currentDate.getTime()

      console.log(nonce, oldDate, oldTime, currentDate, currentTime)
      if (token === nonce && currentTime < oldTime + 120000) {
        resolve(true);
      } else {
        let failure = new Error('Token has expired, please try again.')
        reject(failure);
      }
    }
  )
}

function regenerateSession(req) {
  return new Promise (
    (resolve, reject) => {
      req.session.regenerate(function(err) {
        if (err) reject(err)
        else resolve();
      })
    }
  )
}

function lastFourOnly(cardNumber:string) {
	let arr = [];
  cardNumber = cardNumber.split('');

  for (let i = cardNumber.length; arr.length < 5; i-- ) {
    arr.push(cardNumber[i])
   }
   arr.reverse()
   return arr.join('')
}

// next three functions are all to insert an unknown number of rows. Not sure whether to make this nice yet
function queryVariables(queryResult) {
  let tempField = [];
  let finalField = [];
  let length = queryResult.length;
  let innerLength = Object.keys(queryResult[0]).length;

  console.log('length', length)
  for (let j = 0; j < length; j++) {
    tempField.push('(');
    for (let i = 1; i <= innerLength; i++) {
      if (i < innerLength ) {
        tempField.push('$' + [i+(j*innerLength)] + ', ');
      } else {
        tempField.push('$' + [i+(j*innerLength)])
      }
    }
    tempField.push(')');
    finalField.push(tempField.join(''))
    tempField = [];
  }

  return finalField.join(', ');
}


function addOrderUUIDItemNumber(queryResult, order_uuid) {
  for (let i = 0; i < queryResult.length; i++) {
    queryResult[i].order_uuid = order_uuid;
    queryResult[i].item_number = i+1;
  }
  return queryResult;
}

function inputs(queryResult) {
  let tempArray = [];
  for (let i = 0; i < queryResult.length; i++) {
    for (let k in queryResult[i]) {
      if (k === 'product_id') {
        // console.log('product_it', k, queryResult[i][k])
        tempArray.push(queryResult[i][k])
      } else if (k === 'quantity') {
        // console.log('quantity', k, queryResult[i][k])
        tempArray.push(queryResult[i][k])
      } else if (k === 'order_uuid') {
        tempArray.push(queryResult[i][k])
      } else if (k === 'item_number') {
        tempArray.push(queryResult[i][k])
      } else if (k === 'product_history_id') {
        tempArray.push(queryResult[i][k])
      } else if (k === 'discount') {
        tempArray.push(queryResult[i][k])
      }
    }
  }
  return tempArray;
}

function concatQuery(sqlVariables) {
  return "INSERT INTO order_items (product_id, quantity, product_history_id, discount, order_uuid, item_number) VALUES " + sqlVariables;
}

function stringifyQueryOutput(output) {
  let final = '';
  for (let i = 0; i < output.length; i++) {
    final = final + JSON.stringify(output[i]);
  }
  return final;
}


export { randomString, isSessionValid, regenerateSession, lastFourOnly, queryVariables, inputs, concatQuery, addOrderUUIDItemNumber, stringifyQueryOutput };
