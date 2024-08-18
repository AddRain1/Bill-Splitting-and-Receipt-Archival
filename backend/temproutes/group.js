const express = require('express');
const router = express.Router();

//get a list of groups that the user is part of
//Authorization: Must be logged in. Can only see groups that they are a member of. 
router.get('/', async (req, res) => {

});

//create a new group
//Authorization: Must be logged in.
router.get('/add', async (req, res) => {

});

//get information of group with ID
//Authorization: Must be a member of the group
router.get('/:id', async (req, res) => {

});

//update group with ID
//Authorization: Must be the admin of the group
router.get('/:id/update', async (req, res) => {

});

//delete group with ID
//Authorization: Must be the admin of the group
router.get('/:id/delete', async (req, res) => {

});

module.exports = router;