import { Item } from "./itemClass.js";
import mysql from "mysql2/promise";
import { Receipts } from "./receiptsClass.js";
import receiptTable_api from "./receiptsAPI.js";

const HOST = '132.249.238.159';
const USER = 'newperson';
const PASSWORD = 'random';
const DATABASE = 'receipts';

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
    // Override the getAllItems method
    // Static async function to get all items of a receipt from the database
    static async getAllItems(receipt){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to get all items with receipt id = receipt_id from the database
        const [results] = await connection.execute('SELECT * FROM items WHERE receipt_id = ?', [receipt.receipt_id]);
        
        // get items object from results
        const items = results.map(result => new Item(
            result.item_id,
            result.receipt_id,
            result.item_name,
            result.item_price,
            result.item_payee,
            result.created_at
        ));
        // Return the tax object
        return items;
    }

    // Override the getItemById method
    // Static async function to get an item by item_id from the database
    static async getItemById(item_id){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to get all the receipts from the database
        const [results] = await connection.execute('SELECT * FROM items WHERE item_id = ?', [item_id]);
        
        // get item object from results
        const item = results.map(result => new ExpenseRate(
            result.expenseRate_id,
            result.receipt_id,
            result.expenseRate_name,
            result.expenseRate_percentage
        ));
        // Return the item object
        return item;
    }

    // Override the addItem method
    // Static async function to add item to the database
    static async addItem(item){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Get the items with same receipt_id from the database
        const itemQuery = 'SELECT * FROM items WHERE receipt_id = ?';
        const itemParams = [item.receipt_id];
        
        // Check if the item already exists
        const getInfo = await connection.execute(itemQuery, itemParams);
        const exist = getInfo[0].length > 0;
        
        if(exist){
            // Throw an error if the receipt already exists
            throw new Error("item already exist");
        }

        // Execute the query to insert the new item into the database
        const query = 'INSERT INTO items (receipt_id, item_name, item_price, item_payee) VALUES (?, ?, ?, ?)';
        const params = [item.receipt_id, 
            item.name, 
            item.price,
            item.payee];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeItem_name method
    // Static async function to change name of item in the database
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
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to update the item's name in the database
        const query = 'UPDATE items SET item_name = ? WHERE item_id = ?';
        const params = [name, item.item_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeItem_price method
    // Static async function to change price of item in the database
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
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to update the price of item in the database
        const query = 'UPDATE items SET item_price = ? WHERE item_id = ?';
        const params = [percentage, item.item_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeItem_payee method
    // Static async function to change payee of item in the database
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
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to update the payee of item in the database
        const query = 'UPDATE items SET item_payee = ? WHERE item_id = ?';
        const params = [percentage, item.item_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the deleteItem method
    // Static async function to delete a item from the database
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
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        // Execute the query to delete the item from in the database
        const query = 'DELETE FROM items WHERE receipt_id = ?'
        const params = [receipt_id];
        const [results] = await connection.execute(query, params);
        
    }

};