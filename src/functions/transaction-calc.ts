
interface Transactor {
  name:string;
  percent: number;
  fixed: number;
  max: number;
}

const payPalInfo:Transactor = {
  name:'payPal',
  percent: .029,
  fixed: .30,
  max: null
}

const achInfo:Transactor = {
  name:'ach',
  percent: .008,
  fixed: 0,
  max: 5
}

const aliPayInfo:Transactor = {
  name:'aliPay',
  percent: .029,
  fixed: .30,
  max: null
}

const googlePlayInfo:Transactor = {
  name: 'googlePlay',
  percent: 0.30,
  fixed:0,
  max: null
}

const stripeInfo:Transactor = {
  name:'payPal',
  percent: .029,
  fixed: .30,
  max: null
}


class Cut implements Transactor {
  readonly name:string;
  readonly percent: number;
  readonly fixed: number;
  readonly max: number;
  readonly sylPercent: number
  readonly sylStatic: number;

  constructor(obj:Transactor) {
    this.name = obj.name;
    this.percent = obj.percent;
    this.fixed = obj.fixed;
    this.max = obj.max;
    this.sylPercent = .30,
    this.sylStatic = 0
  }

  orgCut(total:number) {
    let transCut = this.transactionCut(total);
    let revenue = this.revenue(total);
    let withTransCut = total - transCut;
    let orgTotal = total - (transCut + revenue);

    let obj = {
      total:total,
      transPercent:this.percent * total,
      transCut:transCut,
      sylPercent:this.sylPercent * total,
      revenue:revenue,
      withTransCut:withTransCut,
      withAllCuts: orgTotal
    }

    console.log(obj)

    if (withTransCut < 0) {
      throw Error ('Total not enough to pay transactor: $' + Number((orgTotal).toFixed(3)));
    } else if (orgTotal < 0) {
      throw Error ('Total not enough to cover costs: $' + Number((orgTotal).toFixed(3)));
    } else {
      return Number((orgTotal).toFixed(3))
    }
  }

  revenue(total:number) {
    let sylSubTotal = (this.sylPercent * total) + this.sylStatic;
    return sylSubTotal;
  }

  transactionCut(total:number) {
    let transCut = (this.percent * total) + this.fixed;
    return transCut;
  }
}

let payPal     = new Cut (payPalInfo);
let ach        = new Cut (achInfo);
let aliPay     = new Cut (aliPayInfo);
let googlePlay = new Cut (googlePlayInfo);
let stripe     = new Cut (stripeInfo)

export {
  payPal,
  ach,
  aliPay,
  googlePlay,
  stripe
}
