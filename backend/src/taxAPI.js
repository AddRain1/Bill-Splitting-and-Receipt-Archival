import mysql from "mysql2/promise";
import { Receipts } from "./receiptsClass.js";
import receiptTable_api from "./receiptsAPI.js";
import { Tax } from "./taxClass.js";

const HOST = 'localhost';
const USER = 'root';
const PASSWORD = 'daniel2002';
const DATABASE = 'receipts';

// Export the abstract class receipt_api
export class tax_api{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === tax_api){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getTax(receipt){
        // Check if the subclass has defined this method
        if(!this.getTax){
            throw new Error("getTax method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async addTax(tax){
        // Check if the subclass has defined this method
        if(!this.addTax){
            throw new Error("addTax method must be defined");
        }
    }


    // Abstract method to be overridden by subclasses
    static async changeTaxPercentage(receipt, tax_percentage){
        // Check if the subclass has defined this method
        if(!this.changeTaxPercentage){
            throw new Error("changeTaxPercentage method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changeTaxName(receipt, tax_name){
        // Check if the subclass has defined this method
        if(!this.changeTaxName){
            throw new Error("changeTaxName method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteTax(receipt_id){
        // Check if the subclass has defined this method
        if(!this.deleteTax){
            throw new Error("deleteTax method must be defined");
        }
    }
}

// Export the class taxTable_api which extends the abstract class tax_api
export default class taxTable_api extends tax_api{
    // Override the getTax method
    // Static async function to get tax of a receipt from the database
    static async getTax(receipt){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to get all the receipts from the database
        const [results] = await connection.execute('SELECT * FROM taxes WHERE receipt_id = ?', [receipt.receipt_id]);
        
        // get tax object from results
        const tax = results.map(result => new Tax(
            result.tax_id,
            result.receipt_id,
            result.tax_name,
            Number(result.tax_percentage)
        ));
        connection.end();

        // Return the tax object
        return tax;
    }

    // Override the addTax method
    // Static async function to add tax to the database
    static async addTax(tax){

        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Get the tax from the database
        const taxQuery = 'SELECT * FROM taxes WHERE receipt_id = ?';
        const taxParams = [tax.receipt_id];
        
        // Check if the receipt already exists
        const getInfo = await connection.execute(taxQuery, taxParams);
        const exist = getInfo[0].length > 0;
        
        if(exist){
            // Throw an error if the receipt already exists
            throw new Error("tax already exist");
        }

        // Execute the query to insert the new receipt into the database
        const query = 'INSERT INTO taxes (receipt_id, tax_name, tax_percentage) VALUES (?, ?, ?)';
        const params = [tax.receipt_id, 
            tax.name, 
            tax.percentage];
        const [results] = await connection.execute(query, params);
        connection.end();

    }

    // Override the changeTaxPercentage method
    // Static async function to change percentage of tax in the database
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
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to update the tax percentage in the database
        const query = 'UPDATE taxes SET tax_percentage = ? WHERE receipt_id = ?';
        const params = [tax_percentage, receipt.receipt_id];
        const [results] = await connection.execute(query, params);
        connection.end();

    }

    // Override the changeTaxName method
    // Static async function to change name of tax in the database
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
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to update the name of tax in the database
        const query = 'UPDATE taxes SET tax_name = ? WHERE receipt_id = ?';
        const params = [tax_name, receipt.receipt_id];
        const [results] = await connection.execute(query, params);
        connection.end();

    }

    // Override the deleteTax method
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
        
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        // Execute the query to delete the tax with receipt_id from the database
        const query = 'DELETE FROM taxes WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);
        connection.end();

        
    }
}