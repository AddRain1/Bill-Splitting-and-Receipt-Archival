import receiptTable_api from '../../src/receiptsAPI.js';
import { Receipts } from '../../src/receiptsClass.js';
import { Tax } from '../../src/taxClass.js';
import { Tip } from '../../src/tipClass.js';
import { ExpenseRate } from '../../src/expenseRateClass.js';
import { Item } from '../../src/itemClass.js';
import taxTable_api from "../../src/taxAPI.js";
import tipTable_api from '../../src/tipAPI.js';

function _isDate(date){
    return date instanceof Date && !isNaN(date);
}

// helper function to generate id based on current time
// in the form YYYYMMDDHHMMSS
function _generateReceipt_id(date){
    if(_isDate(date)){
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const hour = date.getUTCHours().toString().padStart(2, '0');
        const minute = date.getUTCMinutes().toString().padStart(2, '0');
        const second = date.getUTCSeconds().toString().padStart(2, '0');
        const hash = `${year}${month}${day}${hour}${minute}${second}`;
        //2024-07-15::00:00:00 will look like 20240715000000
        return hash;
    }
    else{
        throw new Error(`Invalid date: ${date}`);
    }
}

const date = new Date();
const receipt_id = _generateReceipt_id(date);
const receipt = new Receipts(receipt_id, 2, 'image.png', 'mcdonald', 'mcdonald receipt', 'food');
receipt.vendor = 'vendor';
receipt.tax = new Tax(1, receipt_id, 'taxname', 0.08);
receipt.tip = new Tip(1, receipt_id, 0.11);
receipt.expense_rate = new ExpenseRate(1, receipt_id, 'expr1', 0.10);
const item1 = new Item(1, receipt_id, '001',  'item1', 1.00);
const item2 = new Item(2, receipt_id, '001',  'item2', 2.00);
receipt.items = [item1, item2];

test('test getting all receipts from database', async () => {
    await receiptTable_api.getAllReceipts().then((res) => {
        expect(res).toBeInstanceOf(Array)
    })
})

test('test adding a receipt to the database', async () => {
    
    const getAllResult = await receiptTable_api.getAllReceipts();
    const arrSize = getAllResult.length;
    
    await receiptTable_api.addReceipt(receipt)
    await receiptTable_api.getAllReceipts().then((res) => {
        const newArrSize = res.length;
        expect(newArrSize).toBe(1 + arrSize);
    })
    
})

test('test getting a receipt from the database', async () => {
    await receiptTable_api.getReceiptByID(receipt_id).then((res) => {
        expect(res.description).toBe(receipt.description);
        expect(res.tax.percentage).toBe(receipt.tax.percentage);
        expect(res.tip.amount).toBe(receipt.tip.amount);
        expect(res.expense_rate.percentage).toBe(receipt.expense_rate.percentage);
        expect(res.items[0].price).toBe(receipt.items[0].price);
    })
})

test('test getting tip', async () => {
    const tip = await tipTable_api.getTip(receipt);
    const tax = await taxTable_api.getTax(receipt);
    expect(tax[0].percentage).toBe(0.08);

    expect(tip[0].amount).toBe(0.11);
})

test('test getting tax', async () => {
    const tax = await taxTable_api.getTax(receipt);
    expect(tax[0]).toBeInstanceOf(Tax);
})

test('test deleting a receipt from the database', async () => {
    const getAllResult = await receiptTable_api.getAllReceipts();
    const arrSize = getAllResult.length;

    await receiptTable_api.deleteReceipt(receipt.receipt_id)    
    await receiptTable_api.getAllReceipts().then((res) => {
        const newArrSize = res.length;
        expect(newArrSize).toBe(arrSize - 1);
    })
    await taxTable_api.getTax(receipt).then((res) => {
        expect(res.length).toBe(0);
    })
    await tipTable_api.getTip(receipt).then((res) => {
        expect(res.length).toBe(0);
    })
})



