import { ExpenseRate } from "./expenseRateClass.js";
import mysql from "mysql2/promise";
import { Receipts } from "./receiptsClass.js";
import receiptTable_api from "./receiptsAPI.js";

// Export the abstract class receipt_api
export class expenseRateAPI{
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

export default class expRateTableAPI extends expenseRateAPI{
    // Override the getTax method
    // Static async function to get tax of a receipt from the database
    static async getExpRt(receipt){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to get all the receipts from the database
        const [results] = await connection.execute('SELECT * FROM expense_rate WHERE receipt_id = ?', [receipt.receipt_id]);
        
        // get tax object from results
        const expRt = results.map(result => new ExpenseRate(
            result.expenseRate_id,
            result.receipt_id,
            result.expenseRate_name,
            result.expenseRate_percentage
        ));
        // Return the tax object
        return expRt;
    }

    // Override the addTax method
    // Static async function to add tax to the database
    static async addExpRt(expense_rate){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Get the tax from the database
        const taxQuery = 'SELECT * FROM expense_rate WHERE receipt_id = ?';
        const taxParams = [expense_rate.receipt_id];
        
        // Check if the receipt already exists
        const getInfo = await connection.execute(taxQuery, taxParams);
        const exist = getInfo[0].length > 0;
        
        if(exist){
            // Throw an error if the receipt already exists
            throw new Error("expense rate already exist");
        }

        // console.log('rec_id = ' + tax.receipt_id);
        // console.log('tax_nam = ' + tax.name);
        // console.log('tax_perc = ' + tax.percentage);
        // Execute the query to insert the new receipt into the database
        const query = 'INSERT INTO expense_rate (receipt_id, expenseRate_name, expenseRate_percentage) VALUES (?, ?, ?)';
        const params = [expense_rate.receipt_id, 
            expense_rate.name, 
            expense_rate.percentage];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeTaxPercentage method
    // Static async function to change percentage of tax in the database
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
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to insert the new receipt into the database
        const query = 'UPDATE expense_rate SET expenseRate_name = ? WHERE receipt_id = ?';
        const params = [name, receipt.receipt_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeTaxName method
    // Static async function to change name of tax in the database
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
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to insert the new receipt into the database
        const query = 'UPDATE expense_rate SET expenseRate_percentage = ? WHERE receipt_id = ?';
        const params = [percentage, receipt.receipt_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the deleteTax method
    // Static async function to delete a receipt from the database
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
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });

        const query = 'DELETE FROM expense_rate WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);
        
    }

};