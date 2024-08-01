const express = require('express');
const router = express.Router();
const Receipts = require("../class/receiptsClass.js");
const receiptAPI = require("../api/receiptsAPI.js");
const Tax = require("../class/taxClass.js");
const Tip = require("../class/tipClass.js");
const ExpenseRate = require("../class/expenseRateClass.js");
const helper = require("../helpers/helper.js");

//get a list of receipts from all of the user's groups
//Authorization: Can only see receipts that are part of the user's groups.
router.get('/', async (req, res) => {
    const allReceiptArray = await receiptAPI.getAllReceipts();
    res.send(allReceiptArray);    
});

//create a new receipt
//Authorization: Must be a member of the group that the receipt will be added to. 
router.get('/add', async (req, res) => {
    // get current time
    const currentTime = new Date();
    // generate receipt_id with current time
    const rec_id = helper._date_to_string(currentTime);
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

//get information of receipt with ID
//Authorization: Must be a member of the group that the receipt is part of.
router.get('/:id', async (req, res) => {

});

//update receipt with ID
//Authorization: Must be the admin of the receipt
router.get('/:id/update', async (req, res) => {

});

//delete receipt with ID
//Authorization: Must be the admin of the receipt
router.get('/:id/delete', async (req, res) => {
    // will not only delete receipt but also delete tax and tips
    await receiptAPI.deleteReceipt('20230816000000');
    const allReceiptArray = await receiptAPI.getAllReceipts();
    console.log(allReceiptArray);
    res.send(allReceiptArray);
});

module.exports = router;