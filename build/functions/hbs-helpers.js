"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
// Handlebars.registerHelper('fullName', function(person:Person) {
//   return person.firstName + " " + person.lastName;
// });
let context = {
    author: { firstName: "Alan", lastName: "Johnson" },
    body: "I Love Handlebars",
    comments: [{
            author: { firstName: "Yehuda", lastName: "Katz" },
            body: "Me too!"
        }]
};
module.exports = {
    fullName: function (person) {
        return person.firstName + " " + person.lastName;
    }
};
//# sourceMappingURL=hbs-helpers.js.map