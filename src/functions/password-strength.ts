import * as words from 'an-array-of-english-words'

// cardinality

function cardinalityGuess(password) {
  let cardinality = 0;

  let lowerCase = /[a-z]/,
      upperCase = /[A-Z]/,
      numbers = /\d/,
      symbols = /[`~!@#$%^&*()\-_=+\[\]\\\{\};"':,<\.>\/?|]/;

  if (password.match(lowerCase)) {
    console.log('positive lowercase search')
    cardinality = cardinality + 26;
  }

  if(password.match(upperCase)) {
    console.log('positive uppercase search')
    cardinality = cardinality + 26;
  }

  if(password.match(numbers)) {
    console.log('positive number search')
    cardinality = cardinality + 10;
  }

  if(password.match(symbols)) {
    console.log('positive symbole search', password.search(symbols))
    cardinality = cardinality + 31;
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
function passScorer(password) {
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

    return password.length * (Math.log2(cardinality));;
  }
}


console.log(passScorer('aklsuregfbalkeurksdjf'))

// https://www.bennish.net/password-strength-checker/
