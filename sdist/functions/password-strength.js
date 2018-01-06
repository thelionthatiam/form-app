"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const words = require("an-array-of-english-words");
// entropy
let lowercaseOnly = 26;
let uppercaseToo = 62;
function entropy(length, cardinality) { return length * (Math.log2(cardinality)); }
;
// common words
function dictionaryRE(password) {
    let k = 0;
    let dictLength = words.length;
    let matches = 0;
    let maxMatches = 0;
    let victory = {
        maxMatches: 0,
        runNumber: 0
    };
    // (Math.floor(Math.random() * dictLength))
    while (k < 100) {
        for (let i = 0; i < words.length; i++) {
            var re = new RegExp("^(" + words[i] + ").*", 'g');
            if (password.match(re)) {
                console.log(i, words[i]);
                matches++;
            }
        }
        if (matches > maxMatches) {
            maxMatches = matches;
            victory.maxMatches = maxMatches;
            victory.runNumber = k;
        }
        k++;
    }
    return victory;
}
// console.log(dictionaryRE('horsecart'))
// console.log(words.indexOf('horsecart'));
function numberOfWordsAtLength() {
    let ans = {};
    let wordAtLengthCount = 0;
    let wordLength;
    for (let j = 1; j <= 28; j++) {
        wordAtLengthCount = 0;
        for (let i = 0; i < words.length; i++) {
            if (words[i].length === j) {
                wordAtLengthCount++;
            }
        }
        wordLength = j.toString();
        ans[wordLength] = wordAtLengthCount;
    }
    return ans;
}
console.log(numberOfWordsAtLength());
// testing password crack
function matchWord(subPass) {
    for (let i = 0; i < words.length; i++) {
        if (subPass === words[i]) {
            return true;
        }
    }
    return false;
}
function matchSubword(password) {
    let check = [];
    for (let i = 0; i < password.length; i++) {
        check.push(password[i]);
        console.log(check.join(''));
        if (matchWord(check.join(''))) {
            return check.join('');
        }
    }
    return false;
}
function fourWordCrack(password) {
    let arrayOfWords = [];
    let leftover;
    while (password.length > 0) {
        if (matchSubword(password)) {
            let currentSubword = matchSubword(password);
            arrayOfWords.push(currentSubword);
            password = password.replace(currentSubword, '');
        }
        else {
            console.log(password);
            arrayOfWords.push('FLAG: ' + password);
            return arrayOfWords;
        }
    }
    return arrayOfWords;
}
//# sourceMappingURL=password-strength.js.map