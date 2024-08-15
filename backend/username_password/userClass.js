export class Users{
    user_id;
    username;
    first_name;
    last_name;
    email;
    password;
    profile_description;
    creation_date;
    constructor(user_id, username, first_name, last_name, email, password, profile_description){
        this.user_id = user_id;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.profile_description = profile_description;
        this.creation_date = Date.now();
    }
};

