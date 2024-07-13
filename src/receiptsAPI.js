import express from "express";
import mysql from "mysql2/promise";
import { Receipts } from "./receiptsClass.js";
import { Tax } from "./taxClass.js";
import taxAPI from "./taxAPI.js";

// Export the abstract class receipt_api
export class receipt_api{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === receipt_api){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getAllReceipts(){
        // Check if the subclass has defined this method
        if(!this.getAllReceipts){
            throw new Error("getALLReceipts method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async addReceipt(receipt){
        // Check if the subclass has defined this method
        if(!this.addReceipt){
            throw new Error("addReceipt method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteReceipt(receipt_id){
        // Check if the subclass has defined this method
        if(!this.deleteReceipt){
            throw new Error("deleteReceipt method must be defined");
        }
    }

    static async getReceiptByID(receipt_id){
        if(!this.getReceiptByID){
            throw new Error("getReceiptByID method must be defined");
        }
    }
}

// Export the class receiptTable_api which extends the abstract class receipt_api
export default class receiptTable_api extends receipt_api{
    // Override the getAllReceipts method
    // Static async function to get all the receipts from the database
    static async getAllReceipts(){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to get all the receipts from the database
        const [results, fields] = await connection.execute('SELECT * FROM receipts');
        
        // Map the results to an array of Receipts objects
        const allReceipts = results.map(result => new Receipts(
            result.receipt_id,
            result.group_id,
            result.images,
            result.receipt_name,
            result.receipt_description,
            result.receipt_category,
            result.created_at,
            result.vendor_name
        ));
        // Return the array of Receipts objects
        return allReceipts;
    }

    // Override the addReceipt method
    // Static async function to add a new receipt to the database
    static async addReceipt(receipt){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt already exists
        const exist = receipts.find(r => r.receipt_id === receipt.receipt_id)
        if(exist){
            // Throw an error if the receipt already exists
            throw new Error("Receipt already exists");
        }
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to insert the new receipt into the database
        const query = 'INSERT INTO receipts (group_id, images, receipt_name, receipt_description, receipt_category, vendor_name) VALUES (?, ?, ?, ?, ?, ?)';
        const params = [receipt.group_id, 
            receipt.images, 
            receipt.name, 
            receipt.description, 
            receipt.category, 
            receipt.vendor];
        const [results] = await connection.execute(query, params);
    }

    // Override the deleteReceipt method
    // Static async function to delete a receipt from the database
    static async deleteReceipt(receipt_id){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt is already deleted
        const exist = receipts.find(r => r.receipt_id === receipt_id)
        if(!exist){
            throw new Error("Receipt doesn't exists");
        }

        await taxAPI.deleteTax(receipt_id);
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });

        const query = 'DELETE FROM receipts WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the getReceiptByID method
    // Static async function to get a receipt by ID from the database
    static async getReceiptByID(receipt_id){
        const allreceipts = await receiptTable_api.getAllReceipts();
        const exist = allreceipts.find(r => r.receipt_id === receipt_id);
        if(!exist){
            throw new Error("Receipt with this ID doesn't exists in table");
        }

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        
        const query = 'SELECT * FROM receipts WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);

        const receipt = new Receipts(results[0].receipt_id,
            results[0].group_id,
            results[0].images,
            results[0].receipt_name,
            results[0].receipt_description,
            results[0].receipt_category,
            results[0].created_at,
            results[0].vendor_name);
        return receipt;
    }
}