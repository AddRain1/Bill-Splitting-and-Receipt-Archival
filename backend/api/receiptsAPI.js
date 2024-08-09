const mysql = require("mysql2/promise");
const Receipts = require("../class/receiptsClass.js");
const taxAPI = require("./taxAPI.js");
const tipAPI = require("./tipAPI.js");
const expenseRateAPI = require("./expenseRateAPI.js"); 
const itemAPI = require("./itemAPI.js");
const dotenv = require('dotenv');

dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

class receipt_api{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === receipt_api){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getReceipts(query){
        // Check if the subclass has defined this method
        if(!this.getReceipts){
            throw new Error("getReceipts method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getReceiptByID(receipt_id){
        // Check if the subclass has defined this method
        if(!this.getReceiptByID){
            throw new Error("getReceiptByID method must be defined");
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
    static async changeReceipt(receipt_id, property_name, property_value){
        // Check if the subclass has defined this method
        if(!this.changeReceipt){
            throw new Error("changeReceipt method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteReceipt(receipt_id){
        // Check if the subclass has defined this method
        if(!this.deleteReceipt){
            throw new Error("deleteReceipt method must be defined");
        }
    }
}

// Export the class receiptTable_api which extends the abstract class receipt_api
class receiptTable_api extends receipt_api{
    // Override the getReceipts method
    // Static async function to get all the receipts from the database
    static async getReceipts(query=''){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to get all the receipts from the database
        const [results, fields] = await connection.execute('SELECT * FROM receipts ' + query);
        
        // Map the results to an array of Receipts objects
        const receipts = results.map(result => new Receipts(
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
        for(let i = 0; i < receipts.length; i++){
            let receiptQuery = ' WHERE receipt_id = ' + receipts[i].receipt_id;
            receipts[i].tax = await taxAPI.getTax(receiptQuery);
            receipts[i].tip = await tipAPI.getTip(receiptQuery);
            receipts[i].expense_rate = await expenseRateAPI.getExpenseRate(receiptQuery);
            receipts[i].items = await itemAPI.getItems(receiptQuery);
        }
        return receipts;
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
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
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

    // Override the addReceipt method
    // Static async function to add a new receipt to the database
    static async addReceipt(receipt){
        // Get all the receipts
        const receipts = await receiptTable_api.getReceipts();
        // Check if the receipt already exists
        const exist = receipts.find(r => r.receipt_id === receipt.receipt_id)
        if(exist){
            // Throw an error if the receipt already exists
            throw new Error("Receipt already exists");
        }
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to insert the new receipt into the database
        const query = 'INSERT INTO receipts (receipt_id, group_id, images, receipt_name, receipt_description, receipt_category, vendor_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [receipt.receipt_id,
            receipt.group_id, 
            receipt.images, 
            receipt.name, 
            receipt.description, 
            receipt.category, 
            receipt.vendor];
        const [results] = await connection.execute(query, params);
        // add tax to taxes table
        await taxAPI.addTax(receipt.tax);
        // add tip to tips table
        await tipAPI.addTip(receipt.tip);
        // add expense_rate to expense_rate table
        if(receipt.expense_rate){
            await expenseRateAPI.addExpRt(receipt.expense_rate);
        }
        
    }

    // Override the changeReceipt method
    // Static async function to change a property of receipt in the database
    static async changeReceipt(receipt_id, property_name, property_value){
        // Get the receipt
        const receipt = this.getReceiptByID(receipt_id);
        if(!receipt) throw new Error("receipt doesn't exist");
        
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to update the receipt in the database
        const query = 'UPDATE receipt SET ' + property_name + ' = ?';
        const params = [property_value];
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
        await tipAPI.deleteTip(receipt_id);
        await expenseRateAPI.deleteExpRt(receipt_id);
        await itemAPI.deleteItem(receipt_id);
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        const query = 'DELETE FROM receipts WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);
    }
}

module.exports = receiptTable_api;