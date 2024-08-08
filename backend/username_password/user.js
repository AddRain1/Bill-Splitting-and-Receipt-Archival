export class User {
    user_id;
    username;
    email;
    firstname;
    lastname;
    hashed_password;
    constructor(user_id, username, email, firstname, lastname, hashed_password) {
        this.user_id = user_id;
        this.username = username;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.hashed_password = hashed_password;
    }
}