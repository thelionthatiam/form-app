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
const stripeInfo = {
    name: 'payPal',
    percent: .029,
    fixed: .30,
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
    orgCut(total) {
        let transCut = this.transactionCut(total);
        let revenue = this.revenue(total);
        let withTransCut = total - transCut;
        let orgTotal = total - (transCut + revenue);
        let obj = {
            total: total,
            transPercent: this.percent * total,
            transCut: transCut,
            sylPercent: this.sylPercent * total,
            revenue: revenue,
            withTransCut: withTransCut,
            withAllCuts: orgTotal
        };
        console.log(obj);
        if (withTransCut < 0) {
            throw Error('Total not enough to pay transactor: $' + Number((orgTotal).toFixed(3)));
        }
        else if (orgTotal < 0) {
            throw Error('Total not enough to cover costs: $' + Number((orgTotal).toFixed(3)));
        }
        else {
            return Number((orgTotal).toFixed(3));
        }
    }
    revenue(total) {
        let sylSubTotal = (this.sylPercent * total) + this.sylStatic;
        return sylSubTotal;
    }
    transactionCut(total) {
        let transCut = (this.percent * total) + this.fixed;
        return transCut;
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
let stripe = new Cut(stripeInfo);
exports.stripe = stripe;
//# sourceMappingURL=transaction-calc.js.map