"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let randomString = new Promise((resolve, reject) => {
    let string = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,.<>/?;:'{}[]|";
    for (let i = 0; i <= 40; i++) {
        string += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (typeof string === "undefined") {
        reject("randomString failed to create anything ");
    }
    resolve(string);
});
exports.randomString = randomString;
let isSessionValid = (token, outputs) => {
    return new Promise((resolve, reject) => {
        let nonce = outputs.nonce, oldDate = new Date(outputs.thetime), oldTime = oldDate.getTime(), currentDate = new Date(), currentTime = currentDate.getTime();
        console.log(nonce, oldDate, oldTime, currentDate, currentTime);
        if (token === nonce && currentTime < oldTime + 120000) {
            resolve(true);
        }
        else {
            let failure = new Error('Token has expired, please try again.');
            reject(failure);
        }
    });
};
exports.isSessionValid = isSessionValid;
function regenerateSession(req) {
    return new Promise((resolve, reject) => {
        req.session.regenerate(function (err) {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
exports.regenerateSession = regenerateSession;
function lastFourOnly(cardNumber) {
    let arr = [];
    cardNumber = cardNumber.split('');
    for (let i = cardNumber.length; arr.length < 5; i--) {
        arr.push(cardNumber[i]);
    }
    arr.reverse();
    return arr.join('');
}
exports.lastFourOnly = lastFourOnly;
// next three functions are all to insert an unknown number of rows. Not sure whether to make this nice yet
function queryVariables(queryResult) {
    let tempField = [];
    let finalField = [];
    let length = queryResult.length;
    for (let j = 0; j < length; j++) {
        tempField.push('(');
        for (let i = 1; i <= length; i++) {
            if (i < length) {
                tempField.push('$' + [i + (j * length)] + ', ');
            }
            else {
                tempField.push('$' + [i + (j * length)]);
            }
        }
        tempField.push(')');
        finalField.push(tempField.join(''));
        tempField = [];
    }
    return finalField.join(', ');
}
exports.queryVariables = queryVariables;
function inputs(queryResult, order_uuid) {
    let tempArray = [];
    for (let i = 0; i < queryResult.length; i++) {
        tempArray.push(order_uuid);
        for (let k in queryResult[i]) {
            if (k === 'product_id') {
                // console.log('product_it', k, queryResult[i][k])
                tempArray.push(queryResult[i][k]);
            }
            else if (k === 'quantity') {
                // console.log('quantity', k, queryResult[i][k])
                tempArray.push(queryResult[i][k]);
            }
        }
    }
    return tempArray;
}
exports.inputs = inputs;
function concatQuery(sqlVariables) {
    return "INSERT INTO order_items (order_uuid, product_id, quantity) VALUES " + sqlVariables;
}
exports.concatQuery = concatQuery;
//# sourceMappingURL=helpers-promise.js.map