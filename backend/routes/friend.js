const express = require('express');
const { body, validationResult } = require("express-validator");
const Friends = require('../class/friendsClass.js');
const friendsAPI = require('../api/friendsAPI.js');
const router = express.Router();
const accessHelper = require('../helpers/access.js');

//get a list of friends and friend requests of the user 
//Authorization: Must be logged in. 
router.get('/', async (req, res) => {
    const friends = await accessHelper.get_accepted_friends(req.user.user_id);
    const friend_requests = await accessHelper.get_not_accepted_friends(req.user.user_id);
    if(friends.length == 0 && friend_requests.length == 0) {
        const all_friends = [];
        if(!res.headersSent) res.status(200).json(JSON.stringify(all_friends));
    }
    else{
        const all_friends = friends.concat(friend_requests);
        if(!res.headersSent) res.status(200).json(JSON.stringify(all_friends));
    }
    
});

//create a new friend request
//Authorization: Must be logged in. 
router.post('/add', [
    body("requestor_id", "requestor_id must be in the form of user_id, user_id is 15 characters long")
        .trim()
        .escape(),
    body("receiver_id", "receiver_id must be in the form of user_id, user_id is 15 characters long")
        .trim()
        .escape(),
    body("is_confirmed", "is_confirmed must be false for a new friend_request")
        .trim()
        .equals('false')
        .escape(),
    async (req, res, next) => {
        console.log('was here')

        const errors = validationResult(req);
        console.log(errors)
        console.log(errors.isEmpty())
        await friendsAPI.addFriend(req.body.requestor_id, req.body.receiver_id);
        const query = `SELECT * FROM friends WHERE requester_id = ${req.body.requestor_id} AND receiver_id = ${req.body.receiver_id}`
        const friend_request = await friendsAPI.getFriendByQuery(query);
        console.log('fr is '+ friend_request[0].friend_id)
        if(errors.isEmpty()){
            
            if(!res.headersSent) res.status(200).json([
                friend_request[0].friend_id,
                friend_request[0].requestor_id,
                friend_request[0].receiver_id,
                friend_request[0].is_confirmed,
                friend_request[0].created_at
            ]);
        }
    }
]);

//get information of friend with ID
//Authorization: Must be logged in. If the user not the requester or the receiver, only has access if the friend request was accepted.
router.get('/:id', async (req, res) => {
    const friend = friendsAPI.getFriendById(req.user, req.params.id);
    if(!accessHelper.check_friend_accesible_for_request(req.user, req.params.id)){
        res.status(401).json({msg: 'User must accept the friend request and be the requester or the receiver'});
    }
    else res.sendStatus(200).json(JSON.stringify(friend));
});

//update friend with ID
//Authorization: Must be the receiver, only can toggle is_confirmed to true.
router.get('/:id/update', async (req, res) => {
    if(!accessHelper.check_user_is_receiver(req.user, req.params.id)){
        res.status(401).json({msg: 'User must be the receiver'});
    }
    else {
        await friendsAPI.acceptAddFriend(req.params.id, req.user);
        const friend = await friendsAPI.getFriendById(req.user, req.params.id);
        res.status(200).json(JSON.stringify(friend));
    }
});

//delete friend with ID
//Authorization: Must be the receiver or the requester.
router.get('/:id/delete', async (req, res) => {
    if(!accessHelper.check_friend_accesible_for_delete(req.user, req.params.id)){
        res.status(401).json({msg: 'User must be the requester or the receiver'});
    }
    else{
        await friendsAPI.deleteFriend(req.params.id, req.user);
        res.status(200).json({msg: 'Friend deleted'});
    }
});

module.exports = router;