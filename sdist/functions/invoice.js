"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let test = [];
function invoiceItems(result) {
    let invoiceItems = [];
    let total = 0;
    for (let i = 0; i < result.length; i++) {
        let subtotal = result[i].price * result[i].quantity;
        let quantity = result[i].quantity;
        let name = result[i].name;
        let obj = {
            subtotal: subtotal,
            quantity: quantity,
            name: name
        };
        invoiceItems.push(obj);
    }
    return invoiceItems;
}
exports.invoiceItems = invoiceItems;
function total(invoiceItems) {
    let total = 0;
    for (let i = 0; i < invoiceItems.length; i++) {
        total = total + invoiceItems[i].subtotal;
    }
    return total;
}
exports.total = total;
//# sourceMappingURL=invoice.js.map