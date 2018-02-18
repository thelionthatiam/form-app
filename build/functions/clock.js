"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addLeadingZeros(number) {
    if (number < 10) {
        return '0' + number.toString();
    }
    return number;
}
function theTime() {
    let clock = new Date();
    let h = clock.getHours();
    let m = addLeadingZeros(clock.getMinutes());
    let s = addLeadingZeros(clock.getSeconds());
    return h + ':' + m;
}
function intervalTimer() {
    setInterval(() => { theTime(); }, 1000);
}
exports.intervalTimer = intervalTimer;
//# sourceMappingURL=clock.js.map