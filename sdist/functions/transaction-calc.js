"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payPalInfo = {
    name: 'payPal',
    percent: .029,
    fixed: .30,
    max: null
};
const achInfo = {
    name: 'ach',
    percent: .008,
    fixed: 0,
    max: 5
};
const aliPayInfo = {
    name: 'aliPay',
    percent: .029,
    fixed: .30,
    max: null
};
const googlePlayInfo = {
    name: 'googlePlay',
    percent: 0.30,
    fixed: 0,
    max: null
};
class Cut {
    constructor(obj) {
        this.name = obj.name;
        this.percent = obj.percent;
        this.fixed = obj.fixed;
        this.max = obj.max;
        this.sylPercent = .30,
            this.sylStatic = 0;
    }
    cut(total) {
        let transCut = (this.percent * total) + this.fixed;
        let sylCut = (this.sylPercent * total) + this.sylStatic;
        let withTransCut = total - transCut;
        let withAllCuts = total - (transCut + sylCut);
        let obj = {
            total: total,
            transPercent: this.percent * total,
            transCut: transCut,
            sylPercent: this.sylPercent * total,
            sylCut: sylCut,
            withTransCut: withTransCut,
            withAllCuts: withAllCuts
        };
        console.log(obj);
        if (withTransCut < 0) {
            throw Error('Total not enough to pay transactor: $' + Number((withAllCuts).toFixed(3)));
        }
        else if (withAllCuts < 0) {
            throw Error('Total not enough to cover costs: $' + Number((withAllCuts).toFixed(3)));
        }
        else {
            return Number((withAllCuts).toFixed(3));
        }
    }
}
let payPal = new Cut(payPalInfo);
exports.payPal = payPal;
let ach = new Cut(achInfo);
exports.ach = ach;
let aliPay = new Cut(aliPayInfo);
exports.aliPay = aliPay;
let googlePlay = new Cut(googlePlayInfo);
exports.googlePlay = googlePlay;
//# sourceMappingURL=transaction-calc.js.map