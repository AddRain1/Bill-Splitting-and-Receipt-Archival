class Group {
    group_id;
    admin_id;
    name;
    description;
    constructor(group_id, admin_id, name, description) {
        this.group_id = group_id;
        this.admin_id = admin_id;
        this.name = name;
        this.description = description;
    }
} 

module.exports = Group;