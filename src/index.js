import express from "express";
import mysql from "mysql2";
import { Receipts } from "./receiptsClass.js";
import receiptAPI from "./receiptsAPI.js";
import { Tax } from "./taxClass.js";
import taxAPI from "./taxAPI.js";

const app = express();
// test getallreceipt
app.get('/allreceipts', async (req, res) => {
    const allReceiptArray = await receiptAPI.getAllReceipts();
    res.send(allReceiptArray);    
});
// test addreceipt
app.get('/addreceipt', async (req, res) => {
    const currentTime = new Date();
    const temp_receipt = new Receipts(0, 1, 'image3.jpg', 'receipt 3', 'description of receipt 3', 'food', currentTime, 'vendor 3');
    const temp_tax = new Tax(0, 1)
    console.log(temp_receipt);
    await receiptAPI.addReceipt(temp_receipt);
    const allReceiptArray = await receiptAPI.getAllReceipts();
    console.log(allReceiptArray);
    res.send(allReceiptArray);
});
// test deletereceipt
app.get('/deletereceipt', async (req, res) => {
    await receiptAPI.deleteReceipt(4);
    const allReceiptArray = await receiptAPI.getAllReceipts();
    console.log(allReceiptArray);
    res.send(allReceiptArray);
});
// test getReceiptByID

// test gettax
app.get('/gettax', async (req, res) => {
    const receipt = await receiptAPI.getReceiptByID(1);
    const tax = await taxAPI.getTax(receipt);
    console.log(tax);
    res.send(tax);
});

app.listen(3000);