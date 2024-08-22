// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
// import { Friends } from './friendClass.js';

const mysql = require("mysql2/promise");
const Friends = require("../class/friendsClass.js");
const dotenv = require('dotenv');

dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;

// Export the abstract class friends_api
class friends_api{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === friends_api){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getAllFriends(){
        // Check if the subclass has defined this method
        if(!this.getAllFriends){
            throw new Error("getAllFriends method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getFriendByQuery(query){
        // Check if the subclass has defined this method
        if(!this.getFriendByQuery){
            throw new Error("getFriendByQuery method must be defined");
        }
    
    }

    // Abstract method to be overridden by subclasses
    static async getFriendById(friend_id){
        // Check if the subclass has defined this method
        if(!this.getFriendById){
            throw new Error("getFriendById method must be defined");
        }
    
    }

    // Abstract method to be overridden by subclasses
    static async getFriendOfUser(user_id){
        // Check if the subclass has defined this method
        if(!this.getFriendOfUser){
            throw new Error("getFriendOfUser method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async addFriend(requester_id, receiver_id){
        // Check if the subclass has defined this method
        if(!this.addFriend){
            throw new Error("addFriend method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async acceptAddFriend(requester_id, receiver_id){
        // Check if the subclass has defined this method
        if(!this.acceptAddFriend){
            throw new Error("acceptAddFriend method must be defined");
        }   
    }

    // Abstract method to be overridden by subclasses
    static async deleteFriend(friend_id){
        // Check if the subclass has defined this method
        if(!this.deleteFriend){
            throw new Error("deleteFriend method must be defined");
        }
    }
}

// Export the default class friendsAPI which extends the friends_api class
class friendsAPI extends friends_api{
    // Static method to get all friends from the database
    static async getAllFriends(){
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Query to select all friends from the friends table
        const query = 'SELECT * FROM friends';
        // Execute the query and store the results
        const [results] = await connection.execute(query);
        // Map the results to a new Friends object
        const allFriends = results.map(result => new Friends(
            result.friend_id, 
            result.requester_id, 
            result.receiver_id, 
            result.is_confirmed,
            result.creation_date));
        
        // Return the array of all friends
        return allFriends;
    }

    // Static method to get a friend from the database using any query
    static async getFriendByQuery(query){
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Execute the query and store the results
        const [results] = await connection.execute(query);
        // Map the results to a new Friends object
        const allFriends = results.map(result => new Friends(
            result.friend_id, 
            result.requester_id, 
            result.receiver_id, 
            result.is_confirmed,
            result.creation_date));
        // Return the array of all friends
        return allFriends;
    }

    // Static method to get a friend by their friend_id from the database
    static async getFriendById(user_id, friend_id){
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Query to select a friend from the friends table by their friend_id
        const friendQuery = 'SELECT * FROM friends WHERE (requestor_id = ? AND receiver_id = ?) OR (requestor_id = ? AND receiver_id = ?)';
        // Parameter to pass into the query
        const friendParam = [user_id, friend_id, user_id, friend_id];
        // Execute the query and store the results
        const [results] = await connection.execute(friendQuery, friendParam);
        // Create a new Friends object with the results
        const friend = new Friends(
            results[0].friend_id,
            results[0].requester_id,
            results[0].receiver_id,
            results[0].is_confirmed,
            results[0].creation_date
        );
        
        // Return the friend object
        return friend;
    }

    // Static method to get all friends of a user from the database
    static async getFriendOfUser(user_id){
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Query to select all friends of a user from the friends table
        const friendQuery = '(SELECT receiver_id AS friend FROM friends WHERE requester_id = ? AND is_confirmed = ?) UNION (SELECT requester_id AS friend FROM friends WHERE receiver_id = ? AND is_confirmed = ?);';
        // Parameters to pass into the query
        const friendParam = [user_id, true, user_id, true];
        // Execute the query and store the results
        const [results] = await connection.execute(friendQuery, friendParam);
        const allFriends = results.map(result => new Friends(
            result.friend_id, 
            result.requester_id, 
            result.receiver_id, 
            result.is_confirmed,
            result.creation_date));
        
        return allFriends;
    }

    // Static method to add a friend to the database
    static async addFriend(requester_id, receiver_id){
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Query to insert a new friend into the friends table
        const query = 'INSERT INTO friends (requester_id, receiver_id, is_confirmed) VALUES (?, ?, ?)';
        // Parameters to pass into the query
        const params = [requester_id, receiver_id, false];
        // Execute the query
        await connection.execute(query, params);
    }


    // Static method to accept a friend request
    static async acceptAddFriend(requester_id, receiver_id){
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Query to update the is_confirmed field in the friends table
        const queryOne = 'UPDATE friends SET is_confirmed = ? WHERE ( requester_id = ? AND receiver_id = ? ) OR ( requester_id = ? AND receiver_id = ? )';
        // Parameters to pass into the query
        const paramsOne = [true, requester_id, receiver_id, receiver_id, requester_id];
        // Execute the query
        await connection.execute(queryOne, paramsOne);
        
    }

    // Static method to delete a friend from the database
    static async deleteFriend(requester_id, receiver_id){
        // Create a connection to the database
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // Query to delete a friend from the friends table
        const queryOne = 'DELETE FROM friends WHERE ( requester_id = ? AND receiver_id = ? ) OR ( requester_id = ? AND receiver_id = ? )';
        // Parameters to pass into the query
        const paramsOne = [requester_id, receiver_id, receiver_id, requester_id];
        // Execute the query
        await connection.execute(queryOne, paramsOne);
    }
}

module.exports = friendsAPI;