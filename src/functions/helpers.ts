import * as bcrypt from 'bcrypt';
import * as merge from './merge';

// REMOVE OR REWORK THESE FUNCTIONS---------------------------------
// want to remove req, but session.regenerate doesn't return promise
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
// these error functions will be removed entirely with new structure, no res being passed in
// could latch on to the error event
function dbError(res:ModResponse, thisPage:string, err:string) {
  res.render(thisPage, { dbError: dbErrTranslator(err)});
}

function genError(res:ModResponse, thisPage:string, param:Error | string) {
  res.render(thisPage, { dbError: param } );
}
// REMOVE OR REWORK THESE FUNCTIONS---------------------------------



// BUSINESS LOGIC TIER


function dbErrTranslator(error:string) {
  let emailChecker = /(email)/g
    , phoneChecker = /(phone)/g
    , keyChecker = /(key)/g
    , checkChecker = /(check)/g
    , passChecker = /(password)/g
    , lengthChecker = /(value too long)/g
    , alarms = /(alarms)/g
    , awake = /(awake)/g
    , title = /(title)/g

  if (emailChecker.test(error)) {
    if (keyChecker.test(error)) {
      return "The email you put in has already been used. Try again.";
    } else {
      return "You did not submit a valid email. Try again.";
    }
  } else if (phoneChecker.test(error)) {
    if (keyChecker.test(error)) {
      return "The phone number you put in has already been used. Try again.";
    } else {
      return "You did not submit a valid phone number. Try again.";
    }
  } else if (passChecker.test(error)) {
    return "There was an error with your password. Contact the administrator.";

  } else if (lengthChecker.test(error)) {
    return "You typed in something over 100 characters. Keep things a shorter and try again.";
  } else if (alarms.test(error)) {
    if (awake.test(error)) {
      return "You need to use military time. If the it is before 10:00, use leading zeros like this 06:00."
    } else if (title.test(error)) {
      return "Keep your title withing 15 characters. Other than that, you should be able to do whatever you want."
    }
  } else {
    console.log("ERROR", error);
    return "There was an error. Try again.";
  }
}

function compare (a:Alarm, b:Alarm) {
	const awakeA = parseInt(a.awake);
	const awakeB = parseInt(b.awake);

	let comp = 0
	if (awakeA > awakeB) {
		comp = 1;
	} else if (awakeB > awakeA) {
		comp = -1;
	}
	return comp;
}


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

      if (token === nonce && currentTime < oldTime + 120000) {
        resolve(true);
      } else {
        let failure = new Error('Token has expired, please try again.')
        reject(failure);
      }
    }
  )
}

let merger = (objectOne, objectTwo) => {
  return new Promise(
    (resolve, reject) => {
      let ans = merge.deepMerge(objectOne, objectTwo);
      if (ans === 'circular object') {
        let failure = new Error('Circular object')
        reject(failure);
      } else {
        resolve(ans);
      }
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

// COULD GENERALIZE THIS FUNCTION: ADD KEY/VALUE(S) PAIR TO OBJCT
function addOrderUUIDItemNumber(queryResult, order_uuid) {
  for (let i = 0; i < queryResult.length; i++) {
    queryResult[i].order_uuid = order_uuid;
    queryResult[i].item_number = i+1;
  }
  return queryResult;
}

export {
  dbErrTranslator,
  dbError,
  genError,
  compare,
  randomString,
  isSessionValid,
  regenerateSession,
  lastFourOnly,
  addOrderUUIDItemNumber,
  merger
};
