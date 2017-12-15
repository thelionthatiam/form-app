// if obj1 is an Array of T and obj2 is an Array of T
//   return mergeArray(obj1 as Array of T, obj2 as Array of T)
// else if obj1 is a Map and obj2 is a Map
//   return mergeMap(obj1 as Map, obj2 as Map)
// # the rest are non object but we also need to verify their types...
// else if obj1 is Scalar Type 1 and obj is Scalar Type 1
//   return mergeScalarType1(obj1 as Scalar Type1, obj2 as Scalar Type 2)
// ...
// else # invalid merge
//   throw error that indicates invalid merge.
function isCyclic(obj) {
    var seenObjects = [];
    function detect(obj) {
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
function isScalar(obj) { return (/string|number|boolean/).test(typeof obj); }
function mergeArray(arr1, arr2) {
    let concatArray = arr1.concat(arr2);
    return concatArray;
}
function typeSort(item1, item2) {
    if (Array.isArray(item1) && Array.isArray(item2)) {
        return mergeArray(item1, item2);
    }
    else if (isScalar(item1) && isScalar(item2)) {
        if (typeof item1 === "string" && typeof item2 === "string") {
            return item2;
        }
        else if (typeof item1 === "number" && typeof item2 === "number") {
            return item2;
        }
        else if (typeof item1 === "boolean" && typeof item2 === "boolean") {
            return item2;
        }
        else if (typeof item1 === "symbol" && typeof item2 === "symbol") {
            return item2;
        }
        else if (typeof item1 === "function" && typeof item2 === "function") {
            return item2;
        }
    }
    else if (item1 instanceof Object && item2 instanceof Object) {
        return merge(item1, item2);
    }
    else if (typeof item1 === "undefined") {
        return item2;
    }
    else {
        return "Invalid merge";
    }
}
function merge(one, two) {
    if ((!isCyclic(one)) && (!isCyclic(two))) {
        for (let prop in two) {
            one[prop] = typeSort(one[prop], two[prop]);
        }
    }
    else {
        return "circular object";
    }
    return one;
}
//# sourceMappingURL=new-merge.js.map