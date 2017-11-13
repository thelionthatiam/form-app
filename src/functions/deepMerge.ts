function isCyclic (obj:any) {
  var seenObjects:any = []; // so that the array builds outside the loop

  function detect (obj:any) {
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

function isObj(prop:any) {
	if (typeof prop === "object") {
		return true;
	} else {
		return false;
	}
}

function deepMerge(obj1:any, obj2:any) {
	if (isCyclic(obj1)) { // may want better reporting here
		return "cyclic 1";
	} else if (isCyclic(obj2)) {
		return "cyclic 2";
	}

	for (var prop in obj2) {
		if (typeof obj1[prop] !== 'undefined') {
			if (isObj(obj2[prop])) {
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
