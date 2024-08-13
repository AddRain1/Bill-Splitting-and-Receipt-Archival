const express = require('express');
const router = express.Router();

//get a list of friends and friend requests of the user 
//Authorization: Must be logged in. 
router.get('/', async (req, res) => {

});

//create a new friend request
//Authorization: Must be logged in. 
router.get('/add', async (req, res) => {

});

//get information of friend with ID
//Authorization: Must be logged in. If the user not the requester or the receiver, only has access if the friend request was accepted.
router.get('/:id', async (req, res) => {

});

//update friend with ID
//Authorization: Must be the receiver, only can toggle is_confirmed to true.
router.get('/:id/update', async (req, res) => {

});

//delete friend with ID
//Authorization: Must be the receiver or the requester.
router.get('/:id/delete', async (req, res) => {

});

module.exports = router;