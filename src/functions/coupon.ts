import { db } from '../middleware/database';


function percentOff(percent:number, price:number) {
  return price - (price * percent);
}

function twentyOffTotal(total:number){
  return percentOff(total, 0.20);
}

function itemPresent(items:string[], item:string) {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === item) {
      return true;
    }
  }
  return false;
}

export { percentOff };
