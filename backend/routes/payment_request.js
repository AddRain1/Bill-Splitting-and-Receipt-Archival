const express = require('express');
const router = express.Router();

//get a list of payment requests 
//Authorization: Must be logged in. Can only see payment request if they are the payer, they are the receiver, or have access to the linked receipt.
router.get('/', async (req, res) => {

});

//create a new payment request
//Authorization: Must be logged in. Must have access to the receipt they optionally link. 
router.get('/add', async (req, res) => {

});

//get information of payment with ID
//Authorization: Must be logged in. Can only see payment request if they are the payer, they are the receiver, or have access to the linked receipt.
router.get('/:id', async (req, res) => {

});

//update payment request with ID
//Authorization: If the payer, can toggle is_declined. If the receiver, can edit amount, deadline, and mark as paid. Paid on date automatically set when payment is verified.
router.get('/:id/update', async (req, res) => {

});

//delete payment request with ID
//Authorization: Must be the receiver.
router.get('/:id/delete', async (req, res) => {

});

module.exports = router;