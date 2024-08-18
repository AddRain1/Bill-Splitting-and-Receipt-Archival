const express = require('express');
const router = express.Router();

//get a list of taxes for the receipts that the user has access to.
//Authorization: Must be logged in.
router.get('/', async (req, res) => {

});

//create a new tax
//Authorization: Must have access to the receipt that the tax is assigned to. 
router.get('/add', async (req, res) => {

});

//get information of tax with ID
//Authorization: Must have access to the receipt that the tax is assigned to.
router.get('/:id', async (req, res) => {

});

//update tax with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/update', async (req, res) => {

});

//delete tax with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/delete', async (req, res) => {

});

module.exports = router;