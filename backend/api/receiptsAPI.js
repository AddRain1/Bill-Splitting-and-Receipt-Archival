const mysql = require("mysql2/promise");
const Receipts = require("../class/receiptsClass.js");
const taxAPI = require("./taxAPI.js");
const tipAPI = require("./tipAPI.js");
const expenseRateAPI = require("./expenseRateAPI.js"); 
const itemAPI = require("./itemAPI.js");
const paymentRequestAPI = require('./paymentRequestAPI.js');
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
        const [results] = await connection.execute('SELECT * FROM receipts ' + query);
        
        // Map the results to an array of Receipts objects
        const receipts = results.map(result => new Receipts(
            result.admin_id,
            result.group_id,
            result.name,
            result.description,
            result.images,
            result.category,
            result.creation_date,
            result.vendor,
            result.receipt_id
        ));

        await connection.close();

        return receipts;
    }

    // Override the getReceiptByID method
    // Static async function to get a receipt by ID from the database
    static async getReceiptByID(receipt_id){

        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        const [results] = await connection.query('SELECT * FROM receipts WHERE receipt_id = ?', [receipt_id]);
        const result = results[0];
        const receipt = new Receipts(
            result.admin_id,
            result.group_id,
            result.receipt_name,
            result.receipt_description,
            result.images,
            result.receipt_category,
            result.created_at,
            result.vendor_name,
            result.receipt_id
        );

        await connection.end();

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
        const query = 'INSERT INTO receipts (admin_id, group_id, name, description, images, category, vendor) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [
            receipt.admin_id,
            receipt.group_id, 
            receipt.name, 
            receipt.description, 
            receipt.images, 
            receipt.category, 
            receipt.vendor];
        const [results] = await connection.execute(query, params);
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
        const query = 'UPDATE receipts SET ' + property_name + ' = ?';
        const params = [property_value];
        const [results] = await connection.execute(query, params);
    }

    // Override the deleteReceipt method
    // Static async function to delete a receipt from the database
    static async deleteReceipt(receipt_id){
        // Get all the receipts
        const receipts = await this.getReceipts();
        // Check if the receipt is already deleted
        const receipt_ids = receipts.filter(r => r.receipt_id == receipt_id)
        if(receipt_ids.length == 0) throw new Error("Receipt doesn't exist");

        const receipt_query = 'WHERE receipt_id = ' + receipt_id;
        const taxes = await taxAPI.getTaxes(receipt_query);
        for(let tax of taxes) {
            await taxAPI.deleteTax(tax);
        }
        const tips = await tipAPI.getTips(receipt_query);
        for(let tip of tips) {
            await tipAPI.deleteTip(tip);
        }
        const expense_rates = await expenseRateAPI.getExpenseRates(receipt_query);
        for(let expense_rate of expense_rates) {
            await expenseRateAPI.deleteExpenseRate(expense_rate);
        }
        const items = await itemAPI.getItems(receipt_query);
        for(let item of items) {
            await itemAPI.deleteItem(item);
        }
        const payment_requests = await paymentRequestAPI.getPaymentRequests(receipt_query);
        for(let payment_request of payment_requests) {
            await paymentRequestAPI.deletePaymentRequest(payment_request);
        }
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