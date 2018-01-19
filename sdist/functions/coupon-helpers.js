"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function percentOff(percent, price) {
    return price - (price * percent);
}
exports.percentOff = percentOff;
function twentyOffTotal(total) {
    return percentOff(total, 0.20);
}
function itemPresent(items, item) {
    for (let i = 0; i < items.length; i++) {
        if (items[i] === item) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=coupon-helpers.js.map