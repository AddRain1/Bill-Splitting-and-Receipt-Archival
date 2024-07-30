const express = require('express');
const router = express.Router();

//get a list of items assigned to the user
//Authorization: Must be logged in.
router.get('/', async (req, res) => {

});

//create a new item
//Authorization: Must have access to the receipt that the item is assigned to. 
router.get('/add', async (req, res) => {

});

//get information of item with ID
//Authorization: Must have access to the receipt that the item is assigned to.
router.get('/:id', async (req, res) => {

});

//update item with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/update', async (req, res) => {

});

//delete item with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/delete', async (req, res) => {

});

module.exports = router;