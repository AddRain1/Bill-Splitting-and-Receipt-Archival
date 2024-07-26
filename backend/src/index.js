import express from "express";
import mysql from "mysql2";
import { Receipts } from "./receiptsClass.js";
import receiptAPI from "./receiptsAPI.js";
import { Tax } from "./taxClass.js";
import taxAPI from "./taxAPI.js";
import { Tip } from "./tipClass.js";
import tipAPI from "./tipAPI.js";
import { ExpenseRate } from "./expenseRateClass.js";
import expRateTableAPI from "./expenseRateAPI.js";

// helper function to check if given var is a date obj
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

const app = express();
// test getallreceipt
app.get('/allreceipts', async (req, res) => {
    const allReceiptArray = await receiptAPI.getAllReceipts();
    res.send(allReceiptArray);    
});
// test addreceipt
app.get('/addreceipt', async (req, res) => {
    // get current time
    const currentTime = new Date();
    // generate receipt_id with current time
    const rec_id = _generateReceipt_id(currentTime);
    const tax_nm = 'tax 4';
    const tax_per = 2.0;
    // tax information
    const temp_tax = new Tax(0, rec_id, tax_nm, tax_per);
    // tips information
    const temp_tip = new Tip(0, rec_id, 44.44);
    // expense_rate information
    const temp_expense_rate = new ExpenseRate(0, rec_id, 'tempName', 10.00);
    const options = {tax: temp_tax, tip: temp_tip, expense_rate: temp_expense_rate};
    // receipt information
    const temp_receipt = new Receipts(rec_id, 2, 'image3.jpg', 'receipt 3', 'description of receipt 3', 'food', currentTime, 'vendor 3', options);
    // will add receipt to database and add tax/tips to database
    await receiptAPI.addReceipt(temp_receipt);
    const allReceiptArray = await receiptAPI.getAllReceipts();
    console.log(allReceiptArray);
    res.send(allReceiptArray);
});

// test updateGroupID
app.get('/updateGroupID', async (req, res) => {
    const rec = await receiptAPI.getReceiptByID('20240716021644');
    await receiptAPI.updateGroupID(rec, 2);
    const rec_afterchange = await receiptAPI.getReceiptByID('20240716021644');
    res.send(rec_afterchange);
})

// test deletereceipt
app.get('/deletereceipt', async (req, res) => {
    // will not only delete receipt but also delete tax and tips
    await receiptAPI.deleteReceipt('20230816000000');
    const allReceiptArray = await receiptAPI.getAllReceipts();
    console.log(allReceiptArray);
    res.send(allReceiptArray);
});
// test getReceiptByID

// test gettax
app.get('/gettax', async (req, res) => {
    const receipt = await receiptAPI.getReceiptByID('20240716190818');
    const tax = await taxAPI.getTax(receipt);
    console.log(tax);
    res.send(tax);
});

app.listen(3000);