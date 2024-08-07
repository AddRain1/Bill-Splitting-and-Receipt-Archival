const ExpenseRate = require("../class/expenseRateClass.js");
const mysql = require("mysql2/promise");
const Receipts = require("../class/receiptsClass.js");
const receiptTable_api = require("./receiptsAPI.js");
const dotenv = require('dotenv');

dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

// Export the abstract class receipt_api
class expenseRateAPI{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === expenseRateAPI){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getExpRt(receipt){
        // Check if the subclass has defined this method
        if(!this.getExpRt){
            throw new Error("getExpRt method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async addExpRt(expense_rate){
        // Check if the subclass has defined this method
        if(!this.addExpRt){
            throw new Error("addExpRt method must be defined");
        }
    }


    // Abstract method to be overridden by subclasses
    static async changeExpRt_name(receipt, name){
        // Check if the subclass has defined this method
        if(!this.changeExpRt_name){
            throw new Error("changeExpRt_name method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changeExpRt_percentage(receipt, percentage){
        // Check if the subclass has defined this method
        if(!this.changeExpRt_percentage){
            throw new Error("changeExpRt_percentage method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteExpRt(receipt_id){
        // Check if the subclass has defined this method
        if(!this.deleteExpRt){
            throw new Error("deleteExpRt method must be defined");
        }
    }
}

class expRateTableAPI extends expenseRateAPI{
    // Override the getExpRt method
    // Static async function to get expense rate of a receipt from the database
    static async getExpRt(receipt){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to get all the expense rates of a receipt from the database
        const [results] = await connection.execute('SELECT * FROM expense_rate WHERE receipt_id = ?', [receipt.receipt_id]);
        
        // get expense rate object from results
        const expRt = results.map(result => new ExpenseRate(
            result.expenseRate_id,
            result.receipt_id,
            result.expenseRate_name,
            result.expenseRate_percentage
        ));
        // Return the expense rate object
        return expRt;
    }

    // Override the addExpRt method
    // Static async function to add a new expense rate to the database
    static async addExpRt(expense_rate){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Get the expense rate from the database
        const ERQuery = 'SELECT * FROM expense_rate WHERE receipt_id = ?';
        const ERParams = [expense_rate.receipt_id];
        
        // Check if the expense rate with receipt_id already exists
        const getInfo = await connection.execute(ERQuery, ERParams);
        const exist = getInfo[0].length > 0;
        
        if(exist){
            // Throw an error if the expense rate already exists
            throw new Error("expense rate already exist");
        }

        
        // Execute the query to insert the new expense rate into the database
        const query = 'INSERT INTO expense_rate (receipt_id, expenseRate_name, expenseRate_percentage) VALUES (?, ?, ?)';
        const params = [expense_rate.receipt_id, 
            expense_rate.name, 
            expense_rate.percentage];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeExpRt_name method
    // Static async function to change name of expense rate in the database
    static async changeExpRt_name(receipt, name){
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
        // Execute the query to update the name of expense rate into the database
        const query = 'UPDATE expense_rate SET expenseRate_name = ? WHERE receipt_id = ?';
        const params = [name, receipt.receipt_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeExpRt_percentage method
    // Static async function to change the percentage of expense rate in the database
    static async changeExpRt_percentage(receipt, percentage){
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
        // Execute the query to update expense rate percentage into the database
        const query = 'UPDATE expense_rate SET expenseRate_percentage = ? WHERE receipt_id = ?';
        const params = [percentage, receipt.receipt_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the deleteExpRt method
    // Static async function to delete a expense rate from the database
    // Call when deleting receipt
    static async deleteExpRt(receipt_id){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt is already deleted
        const exist = receipts.find(r => r.receipt_id === receipt_id)
        if(!exist){
            throw new Error("Receipt doesn't exists");
        }

        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        // Execute the query to delete expense rate from the database
        const query = 'DELETE FROM expense_rate WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);
        
    }

};

module.exports = expRateTableAPI;