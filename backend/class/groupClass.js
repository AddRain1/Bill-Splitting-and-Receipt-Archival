class Group {
    group_id;
    admin_id;
    name;
    description;
    constructor(admin_id, name, description, group_id=null) {
        this.admin_id = admin_id;
        this.name = name;
        this.description = description;
        this.group_id = group_id;
    }
} 

module.exports = Group;