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
function addDiscount(recieptContent) {
    for (let i = 0; i < recieptContent.length; i++) {
        if (recieptContent[i].discount === 0) {
            recieptContent[i].isDiscount = false;
        }
        else if (recieptContent[i].discount > 0) {
            recieptContent[i].isDiscount = true;
            recieptContent[i].discount = ((recieptContent[i].discount) * 100);
        }
    }
    return recieptContent;
}
exports.addDiscount = addDiscount;
function addEmail(recieptContent, email) {
    for (let i = 0; i < recieptContent.length; i++) {
        recieptContent[i].email = email;
    }
    return recieptContent;
}
exports.addEmail = addEmail;
function totalItems(recieptContent) {
    let totalQuantity = 0;
    for (let i = 0; i < recieptContent.length; i++) {
        totalQuantity = totalQuantity + parseInt(recieptContent[i].quantity, 10);
    }
    return totalQuantity;
}
exports.totalItems = totalItems;
//# sourceMappingURL=invoice.js.map