const mysql = require("mysql2/promise");
const Tip = require("../class/tipClass.js");
const dotenv = require('dotenv');

dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

// Export the abstract class receipt_api
class tip_api{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === tip_api){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    static async getTips(query){
        // Check if the subclass has defined this method
        if(!this.getTips){
            throw new Error("getTips method must be defined");
        }   
    }

    // Abstract method to be overridden by subclasses
    static async getTipByID(id){
        // Check if the subclass has defined this method
        if(!this.getTipByID){
            throw new Error("getTipByID method must be defined");
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
    static async changeTip(id, property_id, property_value){
        // Check if the subclass has defined this method
        if(!this.changeTipAmount){
            throw new Error("changeTipAmount method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteTip(id){
        // Check if the subclass has defined this method
        if(!this.deleteTip){
            throw new Error("deleteTip method must be defined");
        }
    }
}

// Export the class receiptTable_api which extends the abstract class receipt_api
class tipTable_api extends tip_api{
    
    static async getTips(query=''){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to get the tips from the database
        const [results] = await connection.execute('SELECT * FROM tips ' + query);
        
        // get tip object from results
        const tips = results.map(result => new Tip(
            result.tip_id,
            result.receipt_id,
            result.tip_amount
        ));
        // Return the tip object
        return tips;
    }

    static async getTipByID(id){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
    
        const [results] = await connection.execute('SELECT * FROM tips WHERE tip_id = ?', [id]);
    
        if (results.length === 0) {
            throw new Error("No item found for the given ID");
        } 

        // get item object from results
        const result = results[0];
        const tip = new Tip(
            result.tip_id,
            result.receipt_id,
            result.tip_amount,
        );


        // Close connection
        await connection.end();

        // Return the item object
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
        const params = [tip.receipt_id, tip.amount];
        await connection.execute(query, params);
        await connection.end();
    }

    // Override the changeTipAmount method
    // Static async function to update tip amount to the database
    static async changeTip(id, property_id, property_value){
        
        // Check if the tip exists
        const tip = await this.getTipByID(id);
        if (!tip) {
            throw new Error('Tip does not exist');
        }
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to update tips amount in the database
        if (property_id == "amount") {
            await connection.execute('UPDATE tips SET tip_amount = ? WHERE receipt_id = ?', [property_value, tip.receipt_id]);
        }
        
        await connection.end();
    }

    // Override the deleteTip method
    // Static async function to delete a receipt from the database
    // Call when deleting receipt
    static async deleteTip(id){
        
        const tip = await this.getTipByID(id);
        if(!tip) {
            throw new Error('No tip found.');
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
        const params = [tip.receipt_id];
        await connection.execute(query, params);

        await connection.end();
        
    }
}

module.exports = tipTable_api;