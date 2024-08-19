const express = require('express');
const { body, validationResult } = require("express-validator");
const Friends = require('../class/friendsClass.js');
const friendsAPI = require('../api/friendsAPI.js');
const router = express.Router();
const accessHelper = require('../helpers/access.js');

//get a list of friends and friend requests of the user 
//Authorization: Must be logged in. 
router.get('/', async (req, res) => {
    const friends = accessHelper.get_accepted_friends(req.user);
    const friend_requests = accessHelper.get_not_accepted_friends(req.user);
    const all_friends = [...friends, ...friend_requests];
    res.sendStatus(200).json(JSON.stringify(all_friends));
});

//create a new friend request
//Authorization: Must be logged in. 
router.get('/add', async (req, res) => {
    body("requestor_id", "requestor_id must be in the form of user_id, user_id is 15 characters long")
        .trim()
        .isLength({ exact: 15 })
        .escape(),
    body("receiver_id", "receiver_id must be in the form of user_id, user_id is 15 characters long")
        .trim()
        .isLength({ exact: 15 })
        .escape(),
    body("is_confirmed", "is_confirmed must be false for a new friend_request")
        .trim()
        .equals(false)
        .escape(),
        (req, res, next) => {
            const errors = validationResult(req);
            const friend_request = new Friends({
                requestor_id: req.body.requestor_id,
                receiver_id: req.body.receiver_id,
                is_confirmed: req.body.is_confirmed
            });
            if(errors.isEmpty()){
                friendsAPI.addFriend(req.body.requestor_id, req.body.receiver_id)
                res.sendStatus(200).json(JSON.stringify(friend_request));
            }
        }
});

//get information of friend with ID
//Authorization: Must be logged in. If the user not the requester or the receiver, only has access if the friend request was accepted.
router.get('/:id', async (req, res) => {
    const friend = friendsAPI.getFriendById(req.user, req.params.id);
    if(!accessHelper.check_friend_accesible_for_request(req.user, req.params.id)){
        res.sendStatus(401).json({msg: 'User must accept the friend request and be the requester or the receiver'});
    }
    else res.sendStatus(200).json(JSON.stringify(friend));
});

//update friend with ID
//Authorization: Must be the receiver, only can toggle is_confirmed to true.
router.get('/:id/update', async (req, res) => {
    if(!accessHelper.check_user_is_receiver(req.user, req.params.id)){
        res.sendStatus(401).json({msg: 'User must be the receiver'});
    }
    else {
        await friendsAPI.acceptAddFriend(req.params.id, req.user);
        const friend = await friendsAPI.getFriendById(req.user, req.params.id);
        res.sendStatus(200).json(JSON.stringify(friend));
    }
});

//delete friend with ID
//Authorization: Must be the receiver or the requester.
router.get('/:id/delete', async (req, res) => {
    if(!accessHelper.check_friend_accesible_for_delete(req.user, req.params.id)){
        res.sendStatus(401).json({msg: 'User must be the requester or the receiver'});
    }
    else{
        await friendsAPI.deleteFriend(req.params.id, req.user);
        res.sendStatus(200).json({msg: 'Friend deleted'});
    }
});

module.exports = router;