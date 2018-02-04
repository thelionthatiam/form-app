import * as words from 'an-array-of-english-words'

// cardinality

function cardinalityGuess(password) {
  let cardinality = 0;

  let lowerCase = /[a-z]/,
      upperCase = /[A-Z]/,
      numbers = /\d/,
      symbols = /[`~!@#$%^&*()\-_=+\[\]\\\{\};"':,<\.>\/?|]/;

  if (password.match(lowerCase)) {
    cardinality = cardinality + 26;
    console.log('positive lowercase search', 'cardinality', cardinality)
  }

  if(password.match(upperCase)) {
    cardinality = cardinality + 26;
    console.log('positive uppercase search', 'cardinality', cardinality)
  }

  if(password.match(numbers)) {
    cardinality = cardinality + 10;
    console.log('positive number search', 'cardinality', cardinality)
  }

  if(password.match(symbols)) {
    cardinality = cardinality + 33;
    console.log('positive symbol search', 'cardinality', cardinality, password.search(symbols))
  }

  return cardinality;
}

// entropy
function entropy(password) {
  let length = password.length;
  console.log(length);
  let cardinality = cardinalityGuess(password);
  console.log(cardinality);

  return length*(Math.log2(cardinality));
};


function wordsInPass(password) {
  let ans = {};
  let count = 0;
  let numberOfWords;


  for (let i = 0; i < words.length; i++) {
    var re = new RegExp("(" + words[i] + ")", 'g')

    if (password.match(re)) {
      count++
      numberOfWords = count.toString();
      ans[numberOfWords] = words[i];
    }
  }

  for (let k in ans) {
    var re = new RegExp("(" + ans[k] + ")", 'g')
    for(let key in ans) {
       if (ans[key].match(re) && ans[key] !== ans[k]) {
        delete ans[k]
       }
    }
  }

  let finalArr = [];
  for (let j in ans) {
    finalArr.push(ans[j])
  }

  return finalArr;
}

function totalSubtractedLength(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    count = count + arr[i].length
  }
  return count;
}

// was trying to account for easy guessing of words, but that only works if there are only words
function mixPassScorer(password) {
  let relevantWords = wordsInPass(password);
  let wordsLength = totalSubtractedLength(relevantWords);
  let trueLength = password.length - wordsLength;
  let cardinality = cardinalityGuess(password);
  let symbolOptions = Math.pow(cardinality, trueLength);
  let wordOptions = relevantWords.length * 230000;
  let totalOptions = symbolOptions + wordOptions;

  return totalOptions;
}

// this is probably more realistic, could make a sentence case dictionary, l33t dictionary
function scorer(password) {
  let cardinality = cardinalityGuess(password);
  let relevantWords = wordsInPass(password);
  let wordsLength = totalSubtractedLength(relevantWords);
  let wordOptions = Math.pow(230000, relevantWords.length);
  let trueLength = password.length - wordsLength;
  let symbolOptions = Math.pow(cardinality, password.length)
  let totalOptions = symbolOptions + wordOptions;

  if (cardinality < 27 && words.length === password.length) {
    if (words.length === password.length) {
      console.log('all word pass')
      // return wordOptions;
      return words.length * (Math.log2(230000));
    }
  } else {
    console.log('all symbol pass')
    let symbolOptions = Math.pow(cardinality, password.length);
    let entropy = password.length * (Math.log2(cardinality));;
    return entropy
  }
}

function round(value:number, precision:number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function simpleScorer(password:string) {
  let cardinality = cardinalityGuess(password);
  let symbolOptions = Math.pow(cardinality, password.length);
  let entropy = password.length * (Math.log2(cardinality));;
  return round(entropy, 2)
}

// https://www.bennish.net/password-strength-checker/
// < 28 bits = Very Weak; might keep out family members
// 28 - 35 bits = Weak; should keep out most people, often good for desktop login passwords
// 36 - 59 bits = Reasonable; fairly secure passwords for network and company passwords
// 60 - 127 bits = Strong; can be good for guarding financial information
// 128+ bits = Very Strong; often overkill

module.exports = scorer;
export { simpleScorer };
