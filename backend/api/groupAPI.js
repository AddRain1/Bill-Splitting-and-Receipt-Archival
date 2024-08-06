const Group = require("../class/groupClass.js");
const connection = require("../db.js");

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

    // Abstract method to be overridden by subclasses
    static async changeGroup_admin(group_id, user_id){
        // Check if the subclass has defined this method
        if(!this.changeGroup_admin){
            throw new Error("changeGroup_admin method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changeGroup_name(group_id, name){
        // Check if the subclass has defined this method
        if(!this.changeGroup_name){
            throw new Error("changeGroup_name method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changeGroup_description(group_id, description){
        // Check if the subclass has defined this method
        if(!this.changeGroup_description){
            throw new Error("changeExpRt_name method must be defined");
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
    static async getGroups(query){
        // Execute the query to get all the groups from the database
        const [results] = await connection.execute('SELECT * FROM group WHERE group_id = ?');
        
        // get group object from results
        const groupObj = results.map(result => new Group(
            result.group_id,
            result.admin_id,
            result.name,
            result.description
        ));
        // Return the group object
        return groupObj;
    }

    // Override the addGroup method
    // Static async function to add a new group to the database
    static async addGroup(group, user_ids){        
        // Execute the query to insert the new group into the database
        const query = 'INSERT INTO group (admin_id, name, description) VALUES (?, ?, ?)';
        const params = [group.admin_id, 
            group.name, 
            group.percentage];
        const [results] = await connection.execute(query, params);

        //Insert members into group
        for(let user_id in user_ids) await this.addGroup_member(group.group_id, user_id);
    }

    // Override the getGroup_members method
    // Static async function to get group members from the database
    static async getGroup_members(group_id){
        const query = 'SELECT * FROM user_group WHERE group_id = ?';
        const params = [group_id];
        const [results] = await connection.execute(query, params);
        return results;
    }

    // Override the getUser_groups method
    // Static async function to get groups that a user is part of
    static async getUser_groups(user_id){
        const query = 'SELECT * FROM user_group WHERE user_id = ?';
        const params = [user_id];
        const [results] = await connection.execute(query, params);
        return results;
    }

    // Override the addGroup_member method
    // Static async function to add membership of user for the group in the database
    static async addGroup_member(group_id, user_id){
        // Execute the query to insert the new member into the group
        const query = 'INSERT INTO user_group (user_id, group_id) VALUES (?, ?)';
        const params = [user_id, group_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the deleteGroup_member method
    // Static async function to delete membership of user for the group in the database
    static async deleteGroup_member(group_id, user_id){
        const query = 'DELETE FROM user_group WHERE (user_id, group_id) = (?, ?)';
        const params = [user_id, group_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeGroup_admin method
    // Static async function to change the admin of the group in the database
    static async changeGroup_admin(group_id, user_id){
        // Execute the query to update the admin of the group in the database
        const query = 'UPDATE group SET admin_ID = ? WHERE group_id = ?';
        const params = [user_id, group_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeGroup_name method
    // Static async function to change the name of the group in the database
    static async changeGroup_name(group_id, name){
        // Execute the query to update the name of the group in the database
        const query = 'UPDATE group SET name = ? WHERE group_id = ?';
        const params = [name, group_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changeGroup_description method
    // Static async function to change the description of the group in the database
    static async changeGroup_description(group_id, description){
        // Execute the query to update the description of the group in the database
        const query = 'UPDATE group SET description = ? WHERE group_id = ?';
        const params = [description, group_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the deleteGroup method
    // Static async function to delete a expense rate from the database
    // Call when deleting receipt
    static async deleteGroup(group_id){
        // Get all the groups
        const groups = await groupTableAPI.getGroups();
        // Check if the group is already deleted
        const exist = groups.find(g => g.group_id === group_id)
        if(!exist) throw new Error("Group doesn't exist");

        // Execute the query to delete group from the database
        const group_query = 'DELETE FROM group WHERE group_id = ?'
        const group_params = [group_id];
        const [group_results] = await connection.execute(group_query, group_params);  
        
        // Execute the query to delete group from user_group
        const user_group_query = 'DELETE FROM user_group WHERE group_id = ?';
        const user_group_params = [group_id];
        const [user_group_results] = await connection.execute(user_group_query, user_group_params);
    }

};

module.exports = groupTableAPI;