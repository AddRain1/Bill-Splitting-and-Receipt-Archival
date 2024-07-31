import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { Friends } from './friendClass.js';

dotenv.config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;

// Export the abstract class friends_api
export class friends_api{
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
    static async getFriendById(friend_id){
        // Check if the subclass has defined this method
        if(!this.getFriendById){
            throw new Error("getFriendById method must be defined");
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

export default class friendsAPI extends friends_api{
    static async getAllFriends(){
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        const query = 'SELECT * FROM friends';
        const [results] = await connection.execute(query);
        const allFriends = results.map(result => new Friends(
            result.friend_id, 
            result.requester_id, 
            result.receiver_id, 
            result.is_confirmed,
            result.creation_date));
        connection.end();
        return allFriends;
    }

    static async getFriendById(friend_id){
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        const friendQuery = 'SELECT * FROM friends WHERE friend_id = ?';
        const friendParam = [friend_id];
        const [results] = await connection.execute(friendQuery, friendParam);
        const friend = new Friends(
            results[0].friend_id,
            results[0].requester_id,
            results[0].receiver_id,
            results[0].is_confirmed,
            results[0].creation_date
        );
        return friend;
    }

    static async addFriend(requester_id, receiver_id){
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        const query = 'INSERT INTO friends (requester_id, receiver_id, is_confirmed) VALUES (?, ?, ?)';
        const params = [requester_id, receiver_id, false];
        await connection.execute(query, params);
    }


    static async acceptAddFriend(requester_id, receiver_id){
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        const queryOne = 'UPDATE friends SET is_confirmed = ? WHERE ( requester_id = ? AND receiver_id = ? ) OR ( requester_id = ? AND receiver_id = ? )';
        const paramsOne = [true, requester_id, receiver_id, receiver_id, requester_id];
        await connection.execute(queryOne, paramsOne);
        
    }

    static async deleteFriend(requester_id, receiver_id){
        const connection = await mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASSWORD,
            database: DATABASE
        });
        // all relationships between the two users are deleted
        const queryOne = 'DELETE FROM friends WHERE ( requester_id = ? AND receiver_id = ? ) OR ( requester_id = ? AND receiver_id = ? )';
        const paramsOne = [requester_id, receiver_id, receiver_id, requester_id];
        await connection.execute(queryOne, paramsOne);
    }
}