
function isCyclic<O> (obj:O) {
  let seenObjects:O[] = []; // so that the array builds outside the loop

  function detect<O>(obj:O) {
    if (obj && typeof obj === 'object') {
      if (seenObjects.indexOf(obj) !== -1) {
        return true;
      }
      seenObjects.push(obj);
      for (let key in obj) {
        if (obj.hasOwnProperty(key) && detect(obj[key])) {
          return true;
        }
      }
    }
    return false;
  }

  return detect(obj);
}



function isObj<O>(prop:O):boolean {
	if (Array.isArray(prop)) {
		return false;
	} else if (typeof prop === "object") {
		return true;
	} else {
		return false;
	}
}

function deepMerge<O>(obj1:O, obj2:O) {

  function cyclicTest<O>(obj1:O, obj2:O) {
    if (isCyclic(obj1)) {
      console.log(obj1+' is cyclic');
    	return true;
    } else if (isCyclic(obj2)) {
      console.log(obj2+' is cyclic');
    	return true;
    }
    return false;
  }

	for (let prop in obj2) {
		if (typeof obj1[prop] !== 'undefined') {
			if (isObj(obj2[prop]) && isObj(obj1[prop])) {

				obj1[prop] = deepMerge(obj1[prop], obj2[prop]);

			} else if (Array.isArray(obj1[prop]) && Array.isArray(obj2[prop])) {

				obj1[prop] = deepMerge(obj1[prop], obj2[prop]);

			} else {

				obj1[prop] = obj2[prop];

			}
		} else {

			obj1[prop] = obj2[prop];

		}
	}
	return obj1;
}



export { deepMerge };
