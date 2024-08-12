const Users = require("../class/userClass");
const connection = require('../db');
const mysql = require("mysql2/promise");

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;

// Export the abstract class user_api
class user_api{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === user_api){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getUsers(query){
        // Check if the subclass has defined this method
        if(!this.getUsers) throw new Error("getUsers method must be defined");
    }

    // Abstract method to be overridden by subclasses
    static async getUserByID(query){
        // Check if the subclass has defined this method
        if(!this.getUserByID) throw new Error("getUserByID method must be defined");
    }

    // Abstract method to be overridden by subclasses
    static async addUser(user){
        // Check if the subclass has defined this method
        if(!this.addUser) throw new Error("addUser method must be defined");
    }

    // Abstract method to be overridden by subclasses
    static async changeUser(user_id, property_name, property_value){
        // Check if the subclass has defined this method
        if(!this.changeUser){
            throw new Error("changeUser method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteUser(user_id){
        // Check if the subclass has defined this method
        if(!this.deleteUser){
            throw new Error("deleteUser method must be defined");
        }
    }
}

// Export the class userTable_api which extends the abstract class user_api
class userTable_api extends user_api{
    // Override the getAllUsers method
    static async getUsers(query=''){
        // Execute the query to get all the users from the database
        const results = await connection.execute('SELECT * FROM users ' + query);
        
        // Map the results to an array of User objects
        const users = results.map(result => new Users(
            result.user_id,
            result.username,
            result.first_name,
            result.last_name,
            result.email,
            result.password,
            result.profile_description,
            result.creation_date
        ));
        // Return the array of User objects
        return users;
    }

    static async getUserByID(user_id){
        // Execute the query to get all the users from the database
        const results = await connection.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
        
        // Map the results to an array of User objects
        const users = results.map(result => new Users(
            result.user_id,
            result.username,
            result.first_name,
            result.last_name,
            result.email,
            result.password,
            result.profile_description,
            result.creation_date
        ));
        // Return the array of User objects
        return users;
    }

    // Override the addUser method
    // Static async function to add a new user to the database
    static async addUser(user){
        // Get all the users
        const users = await userTable_api.getAllUsers();
        // Check if the user already exists
        const exist = users.find(u => u.user_id === user.user_id)
        if(exist){
            // Throw an error if the user already exists
            throw new Error("User already exists");
        }
        // Execute the query to insert the new user into the database
        const query = 'INSERT INTO users (user_id, username, first_name, last_name, email, password, profile_description) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [
            user.user_id,
            user.username,
            user.first_name,
            user.last_name,
            user.email,
            user.password,
            user.profile_description,
        ];
        await connection.execute(query, params);
    }

    // Abstract method to be overridden by subclasses
    static async changeUser(user_id, property_name, property_value){
        // Get all the user
        const users = await userTable_api.getUsers();
        // Check if the user already exists
        const exist = users.find(u => u.user_id === user_id)
        if(!exist) throw new Error("User doesn't exists");
        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query to update tips amount in the database
        const query = 'UPDATE users SET' +  property_name + '= ? WHERE user_id = ?';
        const params = [property_value, user_id];
        const [results] = await connection.execute(query, params);
    }

    // Abstract method to be overridden by subclasses
    static async deleteUser(user_id){
        // Get all the users
        const users = await userTable_api.getUsers();
        // Check if the user already exists
        const exist = users.find(u => u.user_id === user_id)
        if(!exist) throw new Error("User doesn't exist");

        // Connect to the MySQL database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });

        // Execute the query to delete the tip with receipt_id from the database
        const query = 'DELETE FROM users WHERE user_id = ?'
        const params = [user_id];
        const [results] = await connection.execute(query, params);
        
    }
}

module.exports = userTable_api;
