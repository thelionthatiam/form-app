"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function applyDefaults(obj) {
    for (let k in obj) {
        if (k === 'dbname' && obj[k] === '') {
            console.log(obj[k], "in dbname");
            obj.dbname = 'formapp';
        }
        else if (k === 'username' && obj[k] === '') {
            console.log(obj[k], "in username");
            obj.username = 'formadmin';
        }
        else if (k === 'password' && obj[k] === '') {
            console.log(obj[k], "in formpassword");
            obj.password = 'formpassword';
        }
    }
    return obj;
}
exports.applyDefaults = applyDefaults;
//# sourceMappingURL=build-assets.js.map