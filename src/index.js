import express from "express";
import mysql from "mysql2";
import { Receipts } from "./receiptsClass.js";
import receiptAPI from "./receiptsAPI.js";

const app = express();

app.get('/allreceipts', async (req, res) => {
    const allReceiptArray = await receiptAPI.getAllReceipts();
    
    console.log(allReceiptArray[0]);
    res.send(allReceiptArray);    
});

app.get('/addreceipt', async (req, res) => {
    const currentTime = new Date();
    const temp_receipt = new Receipts(3, 1, 'image3.jpg', 'receipt 3', 'description of receipt 3', 'food', currentTime, 'vendor 3');
    console.log(temp_receipt);
    await receiptAPI.addReceipt(temp_receipt);
    const allReceiptArray = await receiptAPI.getAllReceipts();
    console.log(allReceiptArray);
    res.send(allReceiptArray);
});

app.get('/deletereceipt', async (req, res) => {
    await receiptAPI.deleteReceipt(4);
    const allReceiptArray = await receiptAPI.getAllReceipts();
    console.log(allReceiptArray);
    res.send(allReceiptArray);
});
app.listen(3000);