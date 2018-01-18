// import { lastFourOnly, queryVariables, inputs, concatQuery, addOrderUUIDItemNumber, stringifyQueryOutput } from './promise-helpers';
//
// interface InvoiceItem {
//   subtotal:number;
//   quantity:number;
//   name:string;
// }
//
//
// function invoiceItems(result:any[]) {
//   let invoiceItems:InvoiceItem[] = [];
//   let total = 0;
//
//   for (let i = 0; i < result.length; i++) {
//     let subtotal = result[i].price * result[i].quantity;
//     let quantity = result[i].quantity;
//     let name = result[i].name;
//
//     let obj = {
//       subtotal: subtotal,
//       quantity: quantity,
//       name: name
//     }
//
//     invoiceItems.push(obj);
//   }
//
//   return invoiceItems;
// }
//
// function total(invoiceItems:InvoiceItem[]) {
//   let total = 0;
//   for (let i = 0; i < invoiceItems.length; i++) {
//     total = total + invoiceItems[i].subtotal;
//   }
//
//   return total;
// }
// let test1 = invoiceItems(test)
// let test2 = total(invoiceItems(test))
//
// console.log('items: \n' + test1 + '\n' + 'total:\n' + test2)
//
//
// let items = stringifyQueryOutput(invoiceItems(test));
// let totals = total(invoiceItems(test)).toString();
//
// console.log('items: \n' + items + '\n' + 'total:\n' + totals)
//
// export {invoiceItems, total};
//# sourceMappingURL=invoice.js.map