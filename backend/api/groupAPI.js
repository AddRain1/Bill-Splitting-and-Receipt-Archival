const Group = require("../class/groupClass.js");
const mysql = require("mysql2/promise");

// Export the abstract class group_api
class groupAPI{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === groupAPI){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getGroups(query){
        // Check if the subclass has defined this method
        if(!this.getGroups){
            throw new Error("getGroups method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getGroupByID(group_id){
        // Check if the subclass has defined this method
        if(!this.getGroupByID){
            throw new Error("getGroupByID method must be defined");
        }
    }
    // Abstract method to be overridden by subclasses
    static async addGroup(group, user_ids){
        // Check if the subclass has defined this method
        if(!this.addGroup){
            throw new Error("addGroup method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getGroup_members(group_id){
        // Check if the subclass has defined this method
        if(!this.getGroup_members){
            throw new Error("getGroup_members method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getUser_groups(user_id){
        // Check if the subclass has defined this method
        if(!this.getUser_groups){
            throw new Error("getUser_groups method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async addGroup_member(group_id, user_id){
        // Check if the subclass has defined this method
        if(!this.addGroup_member){
            throw new Error("addGroup_member method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteGroup_member(group_id, user_id){
        // Check if the subclass has defined this method
        if(!this.deleteGroup_member){
            throw new Error("deleteGroup_member method must be defined");
        }
    }

    static async changeGroup(group_id, property_name, property_value){
        // Check if the subclass has defined this method
        if(!this.changeGroup){
            throw new Error("changeGroup method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deleteGroup(group_id){
        // Check if the subclass has defined this method
        if(!this.deleteGroup){
            throw new Error("deleteGroup method must be defined");
        }
    }
}

class groupTableAPI extends groupAPI{
    // Override the getGroups method
    // Static async function to get all groups from the database
    //Optional query to select from groups
    static async getGroups(query=''){
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Execute the query to get all the groups from the database
        const [results] = await connection.execute('SELECT * FROM `group` ' + query);
        
        // get group object from results
        const groupObj = results.map(result => new Group(
            result.admin_id,
            result.name,
            result.description,
            result.group_id
        ));
        // Return the group object
        return groupObj;
    }

    static async getGroupByID(group_id){
        const groups = await this.getGroups('WHERE group_id = ' + group_id);
        return groups[0];
    }

    // Override the addGroup method
    // Static async function to add a new group to the database
    static async addGroup(group, user_ids){     
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });  

        // Execute the query to insert the new group into the database
        const query = 'INSERT INTO `group` (admin_id, name, description) VALUES (?, ?, ?)';
        const params = [group.admin_id, 
            group.name, 
            group.description];
        await connection.execute(query, params);

        const find_query = 'SELECT * FROM `group` WHERE group_id=(SELECT MAX(group_id) FROM `group`)';
        const [results] = await connection.execute(find_query);
        //Insert members into group
        for(let user_id of user_ids) await this.addGroup_member(results[0].group_id, user_id);
    }

    // Override the getGroup_members method
    // Static async function to get group members from the database
    static async getGroup_members(group_id){
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const query = 'SELECT * FROM user_group WHERE group_id = ?';
        const params = [group_id];
        const [results] = await connection.execute(query, params);
        return results;
    }

    // Override the getUser_groups method
    // Static async function to get groups that a user is part of
    static async getUser_groups(user_id){
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        
        const query = 'SELECT * FROM user_group WHERE user_id = ?';
        const params = [user_id];
        const [results] = await connection.execute(query, params);
        return results;
    }

    // Override the addGroup_member method
    // Static async function to add membership of user for the group in the database
    static async addGroup_member(group_id, user_id){
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        //Only add member if they aren't already a part of the group
        const members = await this.getGroup_members(group_id);
        if(members.filter(m => m.user_id == user_id).length == 0) {
            // Execute the query to insert the new member into the group
            const query = 'INSERT INTO user_group (user_id, group_id) VALUES (?, ?)';
            const params = [user_id, group_id];
            const [results] = await connection.execute(query, params);
        }
    }

    // Override the deleteGroup_member method
    // Static async function to delete membership of user for the group in the database
    static async deleteGroup_member(group_id, user_id){
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const query = 'DELETE FROM user_group WHERE (user_id, group_id) = (?, ?)';
        const params = [user_id, group_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeGroup_description method
    // Static async function to change the description of the group in the database
    static async changeGroup(group_id, property_name, property_value){
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Get the group
        const group = await this.getGroupByID(group_id);
        if(!group) throw new Error("Group doesn't exists");
        // Execute the query to update tips amount in the database
        const query = 'UPDATE `group` SET ' +  property_name + ' = ? WHERE group_id = ?';
        const params = [property_value, group_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the deleteGroup method
    // Static async function to delete a expense rate from the database
    // Call when deleting receipt
    static async deleteGroup(group_id){
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        const groups = await groupTableAPI.getGroupByID(group_id);
        if(!groups) throw new Error("Group doesn't exists");

        // Execute the query to delete group from the database
        const group_query = 'DELETE FROM `group` WHERE group_id = ?'
        const group_params = [group_id];
        const [group_results] = await connection.execute(group_query, group_params);  
        
        // Execute the query to delete group from user_group
        const user_group_query = 'DELETE FROM user_group WHERE group_id = ?';
        const user_group_params = [group_id];
        const [user_group_results] = await connection.execute(user_group_query, user_group_params);
    }

};

module.exports = groupTableAPI;