const express = require('express');
const router = express.Router();

//get a list of users
//Authorization: Must be logged in. 
router.get('/', async (req, res) => {

});

//create a new user
//Authorization: Must verify email to successfully create account
router.get('/add', async (req, res) => {

});

//get information of user with ID
//Authorization: Must be logged in.
router.get('/:id', async (req, res) => {

});

//update user with ID
//Authorization: Must be logged in as the user being updated
router.get('/:id/update', async (req, res) => {

});

//delete user with ID
//Authorization: Must be logged in as the user being deleted
router.get('/:id/delete', async (req, res) => {

});

module.exports = router;