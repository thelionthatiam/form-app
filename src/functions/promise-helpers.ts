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

function lastFourOnly(cardNumber) {
	let arr = [];
  cardNumber = cardNumber.split('');

  for (let i = cardNumber.length; arr.length < 5; i-- ) {
    arr.push(cardNumber[i])
   }
   arr.reverse()
   return arr.join('')
}

export { randomString, isSessionValid, lastFourOnly };
