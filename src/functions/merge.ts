function isCyclic<C>(obj:C) {
  var seenObjects:[C] = [];
  function detect (obj:C) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true;
      }
      seenObjects.push(obj);
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          console.log(obj, 'cycle at ' + key);
          return true;
        }
      }
    }
    return false;
  }
  return detect(obj);
}

function isScalar<S>(obj:S){return (/string|number|boolean/).test(typeof obj);}


function mergeArray<A>(arr1:A, arr2:A) {
  let concatArray = arr1.concat(arr2);
  return concatArray;
}


function typeSort<U>(item1:U, item2:U) {
  if (Array.isArray(item1) && Array.isArray(item2)) { // merge array
    return mergeArray(item1, item2);
  } else if (isScalar(item1) && isScalar(item2)) { // scalar junk
    if (typeof item1 === "string" && typeof item2 === "string") {
      return item2;
    } else if (typeof item1 === "number" && typeof item2 === "number") {
      return item2;
    } else if (typeof item1 === "boolean" && typeof item2 === "boolean") {
      return item2;
    } else if (typeof item1 === "symbol" && typeof item2 === "symbol") {
      return item2;
    } else if (typeof item1 === "function" && typeof item2 === "function") {
      return item2;
    }
  } else if (item1 instanceof Object && item2 instanceof Object) { // merge object
    return  merge(item1, item2);
  } else if (typeof item1 === "undefined") {
	  return item2;
  } else {
    return "Invalid merge"
  }
}


function deepMerge<E>(one:E, two:E) {
  if( (!isCyclic(one)) && (!isCyclic(two)) ) {
    for (let prop in two) {
		one[prop] = typeSort(one[prop], two[prop]);
    }
  } else {
	  return "circular object"
  }
  return one;
}

function MergeArray(array:Object[]) { // unfinished
  if (array.length === 0) {
    return 'error, no object in array'
  } else if (array.length === 1) {
    return array[0]
  } else if (array.length >= 2) {
    for (let i = 1; i < array.length; i++ ) {
      let thisMerge = deepMerge(array[i], array[i-1])
      array.pop()
    }
  }
}

export { deepMerge };
