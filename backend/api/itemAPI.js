const Item = require("../class/itemClass.js");
const mysql = require("mysql2/promise");
const receiptTable_api = require("./receiptsAPI.js");
const dotenv = require('dotenv');

dotenv.config();
const ExpenseRate = require("../class/expenseRateClass.js");

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

// Export the abstract class receipt_api
class itemAPI{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === itemAPI){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    static async getItems() {
        if (!this.getItems) {
            throw new Error("getITems method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getItemById(id){
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
    static async changeItem(item_id, property_id, property_value){
        // Check if the subclass has defined this method
        if(!this.changeItem){
            throw new Error("changeItem method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteItem(id){
        // Check if the subclass has defined this method
        if(!this.deleteItem){
            throw new Error("deleteItem method must be defined");
        }
    }
}

class itemTableAPI extends itemAPI{
    // Override the getAllItems method
    // Static async function to get all items of a receipt from the database
    static async getItems(){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to get all items with receipt id = receipt_id from the database
        const [results] = await connection.execute('SELECT * FROM items');
        
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
    static async getItemById(id){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        
        let results;
        try {
            [results] = await connection.execute('SELECT * FROM items WHERE item_id = ?', [id]);
            if (!results) {
                throw new Error (`No item by item_id = ${id} found.`);
            }
        } catch (error) {
            try {
                [results] = await connection.execute('SELECT * FROM items WHERE receipt_id = ?', [id]);
                if (!results) {
                    throw new Error (`No item by receipt_id = ${id} found.`);
                }
            } catch (error) {
                throw new Error ('No item found.');
            }
        }
        
        // get item object from results
        const item = results.map(result => new ExpenseRate(
            result.expenseRate_id,
            result.receipt_id,
            result.expenseRate_name,
            result.expenseRate_percentage
        ));

        // Close connection
        await connection.end();

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
        await connection.execute(query, params);

        await connection.close();
    }

    // Override the changeItem_name method
    // Static async function to change name of item in the database
    static async changeItem(item_id, property_id, property_value){

        // Get all items
        const items = await this.getItems();
        const exist = items.find(i => i.item_id === item_id)
        if(!exist) throw new Error("Item doesn't exists");

        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        // Execute the query to update the item's property in the database
        if (property_id === "name") {
            await connection.execute('UPDATE items SET item_name = ? WHERE item_id = ?', [property_value], [item_id]);
        }
        else if (property_id === "price") {
            await connection.execute('UPDATE items SET item_price = ? WHERE item_id = ?', [property_value], [item_id]);
        }
        else if (property_id === "receipt_id") {
            await connection.execute('UPDATE items SET receipt_id = ? WHERE item_id = ?', [property_value], [item_id]);
        }
        else if (property_id === "payee") {
            await connection.execute('UPDATE items SET item_payee = ? WHERE item_id = ?', [property_value], [item_id]);
        }
        
        await connection.close();
    }

    // Override the deleteItem method
    // Static async function to delete a item from the database
    // Call when deleting receipt
    static async deleteItem(id){
        // Get all the receipts
        const receipts = await receiptTable_api.getAllReceipts();
        // Check if the receipt is already deleted
        let exist;
        try {
            [exist] = receipts.find(r => r.receipt_id === id);
            if(!exist){
                throw new Error("Receipt doesn't exists");
            }
        } catch (error) {
            try {
                [exist] = receipts.find(r => r.item_id === id);
                if(!exist){
                    throw new Error("Receipt doesn't exists");
                }
            } catch (error) {
                throw new Error("Receipt doesn't exist");
            }
        }

        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        // Execute the query to delete the item from in the database
        let results;
        try {
            [results] = await connection.execute('DELETE FROM items WHERE item_id = ?', [id]);
            if (!results) {
                throw new Error (`No item by item_id = ${id} found.`);
            }
        } catch (error) {
            try {
                [results] = await connection.execute('DELETE FROM items WHERE receipt_id = ?', [id]);
                if (!results) {
                    throw new Error (`No item by receipt_id = ${id} found.`);
                }
            } catch (error) {
                throw new Error ('No item found.');
            }
        }

        await connection.close();
        
    }

};

module.exports = itemTableAPI;