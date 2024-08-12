class Friends{
    friend_id;
    requester_id;
    receiver_id;
    is_confirmed;
    creation_date;
    constructor(friend_id, requester_id, receiver_id, is_confirmed, creation_date){
        this.friend_id = friend_id;
        this.requester_id = requester_id;
        this.receiver_id = receiver_id;
        this.is_confirmed = is_confirmed;
        this.creation_date = creation_date;
    }
    generateId(){
        return this.friend_id;
    }
}

module.exports = Friends;
