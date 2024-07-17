import { Item } from "./itemClass.js";
import mysql from "mysql2/promise";
import { Receipts } from "./receiptsClass.js";
import receiptTable_api from "./receiptsAPI.js";

// Export the abstract class receipt_api
export class itemAPI{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === itemAPI){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getAllItem(receipt){
        // Check if the subclass has defined this method
        if(!this.getAllItem){
            throw new Error("getExpRt method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getItemById(item_id){
        // Check if the subclass has defined this method
        if(!this.getItemById){
                throw new Error("getItemById method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async addItem(item){
        // Check if the subclass has defined this method
        if(!this.addItem){
            throw new Error("addItem method must be defined");
        }
    }


    // Abstract method to be overridden by subclasses
    static async changeItem_name(item, name){
        // Check if the subclass has defined this method
        if(!this.changeItem_name){
            throw new Error("changeItem_name method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changeItem_price(item, price){
        // Check if the subclass has defined this method
        if(!this.changeItem_price){
            throw new Error("changeItem_price method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changeItem_payee(item, payee){
        // Check if the subclass has defined this method
        if(!this.changeItem_payee){
            throw new Error("changeItem_payee method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteItem(receipt_id){
        // Check if the subclass has defined this method
        if(!this.deleteItem){
            throw new Error("deleteItem method must be defined");
        }
    }
}

export default class itemTableAPI extends itemAPI{
    // Override the getTax method
    // Static async function to get tax of a receipt from the database
    static async getAllItems(receipt){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to get all the receipts from the database
        const [results] = await connection.execute('SELECT * FROM items WHERE receipt_id = ?', [receipt.receipt_id]);
        
        // get tax object from results
        const items = results.map(result => new ExpenseRate(
            result.expenseRate_id,
            result.receipt_id,
            result.expenseRate_name,
            result.expenseRate_percentage
        ));
        // Return the tax object
        return items;
    }

    static async getItemById(item_id){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to get all the receipts from the database
        const [results] = await connection.execute('SELECT * FROM items WHERE item_id = ?', [item_id]);
        
        // get tax object from results
        const item = results.map(result => new ExpenseRate(
            result.expenseRate_id,
            result.receipt_id,
            result.expenseRate_name,
            result.expenseRate_percentage
        ));
        // Return the tax object
        return item;
    }

    // Override the addTax method
    // Static async function to add tax to the database
    static async addItem(item){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Get the tax from the database
        const taxQuery = 'SELECT * FROM items WHERE receipt_id = ?';
        const taxParams = [item.receipt_id];
        
        // Check if the receipt already exists
        const getInfo = await connection.execute(taxQuery, taxParams);
        const exist = getInfo[0].length > 0;
        
        if(exist){
            // Throw an error if the receipt already exists
            throw new Error("item already exist");
        }

        // Execute the query to insert the new receipt into the database
        const query = 'INSERT INTO items (receipt_id, item_name, item_price, item_payee) VALUES (?, ?, ?, ?)';
        const params = [item.receipt_id, 
            item.name, 
            item.price,
            item.payee];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeTaxPercentage method
    // Static async function to change percentage of tax in the database
    static async changeItem_name(item, name){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt already exists
        const exist = receipts.find(r => r.receipt_id === item.receipt_id)
        if(!exist){
            // Throw an error if the receipt already exists
            throw new Error("item doesn't exists");
        }
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to insert the new receipt into the database
        const query = 'UPDATE items SET item_name = ? WHERE item_id = ?';
        const params = [name, item.item_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeTaxName method
    // Static async function to change name of tax in the database
    static async changeItem_price(item, price){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt already exists
        const exist = receipts.find(r => r.receipt_id === item.receipt_id)
        if(!exist){
            // Throw an error if the receipt already exists
            throw new Error("item doesn't exists");
        }
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to insert the new receipt into the database
        const query = 'UPDATE items SET item_price = ? WHERE item_id = ?';
        const params = [percentage, item.item_id];
        const [results] = await connection.execute(query, params);
    }

    static async changeItem_payee(item, payee){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt already exists
        const exist = receipts.find(r => r.receipt_id === item.receipt_id)
        if(!exist){
            // Throw an error if the receipt already exists
            throw new Error("item doesn't exists");
        }
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'daniel2002',
            database: 'receipts'
        });
        // Execute the query to insert the new receipt into the database
        const query = 'UPDATE items SET item_payee = ? WHERE item_id = ?';
        const params = [percentage, item.item_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the deleteTax method
    // Static async function to delete a receipt from the database
    // Call when deleting receipt
    static async deleteItem(receipt_id){
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

        const query = 'DELETE FROM items WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);
        
    }

};