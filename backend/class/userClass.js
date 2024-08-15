class Users{
    username;
    first_name;
    last_name;
    email;
    password;
    profile_description;
    creation_date;
    constructor(username, first_name, last_name, email, password, profile_description, creation_date=Date.now(), user_id=null){
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.profile_description = profile_description;
        this.creation_date = creation_date;
        this.user_id = user_id;
    }
}

module.exports = Users;
