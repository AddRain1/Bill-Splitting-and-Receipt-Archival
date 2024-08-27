const mysql = require("mysql2/promise");
const receiptTable_api = require("./receiptsAPI.js");
const Tax = require("../class/taxClass.js");
const dotenv = require('dotenv');

dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

// Export the abstract class receipt_api
class tax_api{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === tax_api){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    static async getTaxes(query){
        // Check if the subclass has defined this method
        if(!this.getTaxes){
            throw new Error("getTaxes method must be defined");
        }   
    }

    static async getTaxById(id) {
        if(!this.getTaxById){
            throw new Error("getTaxById method must be defined");
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
    static async changeTax(id, property_id, property_value){
        // Check if the subclass has defined this method
        if(!this.changeTax){
            throw new Error("changeTax method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteTax(id){
        // Check if the subclass has defined this method
        if(!this.deleteTax){
            throw new Error("deleteTax method must be defined");
        }
    }
}

// Export the class taxTable_api which extends the abstract class tax_api
class taxTable_api extends tax_api{

    static async getTaxes(query=''){
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to get taxes from the database
        const [results] = await connection.execute('SELECT * FROM taxes ' + query);
        
        // get tax object from results
        const taxes = results.map(result => new Tax(
            result.tax_id,
            result.receipt_id,
            result.tax_name,
            result.tax_percentage
        ));
        // Return the tax object
        return taxes;
    }

    static async getTaxById(id){
        const taxes = await this.getTaxes('WHERE tax_id = ' + id);
        return taxes[0];
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
        const params = [tax.receipt_id, tax.name, tax.percentage];
        await connection.execute(query, params);
        await connection.end();
    }

    // Override the changeTaxmethod
    // Static async function to change percentage/name of tax in the database
    static async changeTax(id, property_id, property_value){

        // Get tax by Id
        const [tax] = await this.getTaxById(id);
        if (!tax) {
            throw new Error('Tax does not exist');
        }

        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        // Update tax bassed on property_id
        if (property_id == "name") {
            await connection.execute('UPDATE taxes SET tax_name = ? WHERE tax_id = ?', [property_value], [tax.tax_id]);
        }
        else if (property_id == "percentage") {
            await connection.execute('UPDATE taxes SET tax_percentage = ? WHERE tax_id = ?', [property_value], [tax.tax_id]);
        }

        await connection.end();
    }

    // Override the deleteTax method
    // Static async function to delete a receipt from the database
    // Call when deleting receipt
    static async deleteTax(id){
        
        // Get tax by id
        const [tax] = await this.getTaxById(id);
        if(!tax) {
            throw new Error('No tax found.');
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
        const params = [tax.receipt_id];
        await connection.execute(query, params);

        await connection.end();
        
    }
}

module.exports = taxTable_api;