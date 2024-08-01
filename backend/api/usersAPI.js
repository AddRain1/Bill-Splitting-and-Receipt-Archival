const Users = require("../class/userClass");
const connection = require('../db');

// Export the abstract class user_api
class user_api{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === user_api){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getAllUsers(){
        // Check if the subclass has defined this method
        if(!this.getAllUsers) throw new Error("getAllUsers method must be defined");
    }

    // Abstract method to be overridden by subclasses
    static async addUser(){
        // Check if the subclass has defined this method
        if(!this.addUser) throw new Error("addUser method must be defined");
    }
}

// Export the class userTable_api which extends the abstract class user_api
class userTable_api extends user_api{
    // Override the getAllUsers method
    static async getAllUsers(){
        // Execute the query to get all the users from the database
        const results = await connection.execute('SELECT * FROM users')[0];
        
        // Map the results to an array of User objects
        const allUsers = results.map(result => new Users(
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
        return allUsers;
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
}

module.exports = userTable_api;
