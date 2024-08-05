import mysql from "mysql2/promise";
import { Receipts } from "./receiptsClass.js";
import { Tip } from "./tipClass.js";
import receiptTable_api from "./receiptsAPI.js";

const HOST = 'localhost';
const USER = 'root';
const PASSWORD = 'daniel2002';
const DATABASE = 'receipts';

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
    static async deleteTip(receipt_id){
        // Check if the subclass has defined this method
        if(!this.deleteTip){
            throw new Error("deleteTip method must be defined");
        }
    }
}

// Export the class receiptTable_api which extends the abstract class receipt_api
export default class tipTable_api extends tip_api{
    // Override the getTip method
    static async getTip(receipt){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to get all the tips from the database
        const [results] = await connection.execute('SELECT * FROM tips WHERE receipt_id = ?', [receipt.receipt_id]);
        
        // get tip object from results
        const tip = results.map(result => new Tip(
            result.tip_id,
            result.receipt_id,
            result.tip_amount
        ));
        connection.end();

        // Return the tip object
        return tip;
    }

    // Override the addTip method
    // Static async function to add a new tip to the database
    static async addTip(tip){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Get the tip from the database
        const tipQuery = 'SELECT * FROM tips WHERE receipt_id = ?';
        const tipParams = [tip.receipt_id];
        // Check if the receipt already exists
        const getInfo = await connection.execute(tipQuery, tipParams);
        const exist = getInfo[0].length > 0;
        
        if(exist){
            // Throw an error if the tip already exists
            throw new Error("tip already exist");
        }


        // Execute the query to insert the new tip into the database
        const query = 'INSERT INTO tips (receipt_id, tip_amount) VALUES (?, ?)';
        const params = [ tip.receipt_id, tip.amount];
        const [results] = await connection.execute(query, params);
        connection.end();

    }

    // Override the changeTipAmount method
    // Static async function to update tip amount to the database
    static async changeTipAmount(receipt, tip_amount){
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
        // Execute the query to update tips amount in the database
        const query = 'UPDATE tips SET tip_amount = ? WHERE receipt_id = ?';
        const params = [tip_amount, receipt.receipt_id];
        const [results] = await connection.execute(query, params);
        connection.end();

    }

    // Override the deleteTip method
    // Static async function to delete a receipt from the database
    // Call when deleting receipt
    static async deleteTip(receipt_id){
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

        // Execute the query to delete the tip with receipt_id from the database
        const query = 'DELETE FROM tips WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);
        connection.end();

    }
}