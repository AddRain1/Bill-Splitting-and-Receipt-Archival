/*
    Did not finish
*/

import mysql from "mysql2/promise";
import { Receipts } from "./receiptsClass.js";
import { Tip } from "./tipClass.js";

// Export the abstract class receipt_api
export class tip_api{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === tip_api){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getTip(receipt){
        // Check if the subclass has defined this method
        if(!this.getTip){
            throw new Error("getTip method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async addTip(tip){
        // Check if the subclass has defined this method
        if(!this.addTip){
            throw new Error("addTip method must be defined");
        }
    }


    // Abstract method to be overridden by subclasses
    static async changeTipAmount(receipt, tip_amount){
        // Check if the subclass has defined this method
        if(!this.changeTipAmount){
            throw new Error("changeTipAmount method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteTip(receipt){
        // Check if the subclass has defined this method
        if(!this.deleteTip){
            throw new Error("deleteTip method must be defined");
        }
    }
}

// Export the class receiptTable_api which extends the abstract class receipt_api
export default class tipTable_api extends tip_api{
    // Override the getAllReceipts method
    static async getTip(receipt){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to get all the receipts from the database
        const [results] = await connection.execute('SELECT * FROM tips WHERE receipt_id = ?', [receipt.receipt_id]);
        
        // get tax object from results
        const tip = results.map(result => new Tip(
            result.tip_id,
            result.receipt_id,
            result.tip_amount
        ));
        // Return the tax object
        return tax;
    }

     // Override the addReceipt method
    // Static async function to add a new receipt to the database
    static async addTax(tax){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Get the tax from the database
        const taxQuery = 'SELECT * FROM taxes WHERE tax_id = ?';
        const taxParams = [tax.tax_id];
        // Check if the receipt already exists
        const exist = await connection.execute(taxQuery, taxParams);
        if(exist){
            // Throw an error if the receipt already exists
            throw new Error("tax already exist");
        }


        // Execute the query to insert the new receipt into the database
        const query = 'INSERT INTO taxes (receipt_id, tax_name, tax_percentage) VALUES (?, ?, ?, ?)';
        const params = [tax.receipt_id, 
            tax.tax_name, 
            tax.tax_percentage];
        const [results] = await connection.execute(query, params);
    }

    // Override the addReceipt method
    // Static async function to add a new receipt to the database
    static async changeTaxPercentage(receipt, tax_percentage){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt already exists
        const exist = receipts.find(r => r.receipt_id === receipt.receipt_id)
        if(!exist){
            // Throw an error if the receipt already exists
            throw new Error("Receipt doesn't exists");
        }
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to insert the new receipt into the database
        const query = 'UPDATE taxes SET tax_percentage = ? WHERE receipt_id = ?';
        const params = [tax_percentage, receipt.receipt_id];
        const [results] = await connection.execute(query, params);
    }

    static async changeTaxName(receipt, tax_name){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt already exists
        const exist = receipts.find(r => r.receipt_id === receipt.receipt_id)
        if(!exist){
            // Throw an error if the receipt already exists
            throw new Error("Receipt doesn't exists");
        }
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to insert the new receipt into the database
        const query = 'UPDATE taxes SET tax_name = ? WHERE receipt_id = ?';
        const params = [tax_name, receipt.receipt_id];
        const [results] = await connection.execute(query, params);
    }


    // Static async function to delete a receipt from the database
    // Call when deleting receipt
    static async deleteTax(receipt_id){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt is already deleted
        const exist = receipts.find(r => r.receipt_id === receipt_id)
        if(!exist){
            throw new Error("Receipt doesn't exists");
        }

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });

        const query = 'DELETE FROM taxes WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);
        
    }
}