const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const paymentRequestAPI = require('../api/paymentRequestAPI');
const PaymentRequest = require('../class/paymentRequestClass');
const accessHelper = require('../helpers/access');

//get a list of payment requests 
//Authorization: Must be logged in. Can only see payment request if they are the payer, they are the receiver, or have access to the linked receipt.
router.get('/', async (req, res) => {
    if(req.query.payer_id){
        const query = `WHERE payer_id = ${req.query.payer_id}`;
        const payment_request_list = await paymentRequestAPI.getPaymentRequests(query);
        if(!res.headersSent) res.status(200).json(payment_request_list);
    }
    else if(req.query.receiver_id){
        const query = `WHERE receiver_id = ${req.query.receiver_id}`;
        const payment_request_list = await paymentRequestAPI.getPaymentRequests(query);
        if(!res.headersSent) res.status(200).json(payment_request_list);
    }
    else if(req.query.pay_by){
        const query = `WHERE pay_by = ${req.query.pay_by}`;
        const payment_request_list = await paymentRequestAPI.getPaymentRequests(query);
        if(!res.headersSent) res.status(200).json(payment_request_list);
    }
    else if(req.query.paid_on){
        const query = `WHERE paid_on = ${req.query.paid_on}`;
        const payment_request_list = await paymentRequestAPI.getPaymentRequests(query);
        if(!res.headersSent) res.status(200).json(payment_request_list);
    }
    else if(req.query.amount){
        const query = `WHERE amount = ${req.query.amount}`;
        const payment_request_list = await paymentRequestAPI.getPaymentRequests(query);
        if(!res.headersSent) res.status(200).json(payment_request_list);
    }
    else{
        const payment_request_list = await accessHelper.get_accessible_payment_requests(req.user.user_id);
        if(!res.headersSent) res.status(200).json(payment_request_list);
    }
    
});

//create a new payment request
//Authorization: Must be logged in. Must have access to the receipt they optionally link. 
router.post('/add', [
    body("amount", "Amount must be greater than 0 and is limited to two decimals")
      .trim()
      .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
      .matches(/^\d+.{0,1}\d{0,2}$/)
      .escape(),
    body("description")
        .trim()
        .isLength({max: 250})
        .escape(),
    body("receipt_id")
        .trim()
        .escape()
        .optional({ nullable: true }),
    body("pay_by", "Pay by must be a valid date")
        .trim()
        .isDate()
        .escape()
        .optional({ nullable: true }),
    async (req, res, next) => {
        const errors = validationResult(req);
        const payment_request = new PaymentRequest(
            req.body.payer_id, 
            req.body.receiver_id, 
            req.body.amount, 
            req.body.description,
            req.body.pay_by, 
            req.body.receipt_id
        );

        if(req.user.user_id != req.body.payer_id && req.user.user_id != req.body.receiver_id) res.status(400).json({msg: 'User must be the payer or receiver of the payment request'});
        else if(req.body.receipt_id && (!(await accessHelper.check_receipt_accessible(req.body.payer_id, req.body.receipt_id)) || !(await accessHelper.check_receipt_accessible(req.body.receiver_id, req.body.receipt_id)))) {
            res.status(401).json({msg: 'Payer and receiver must have access to the linked receipt.'});
        }
        else if (errors.isEmpty()) {
            await paymentRequestAPI.addPaymentRequest(payment_request);
            if(!res.headersSent) res.status(200).json(payment_request);
        }
    }
]);

//get information of payment with ID
//Authorization: Must be logged in. Can only see payment request if they are the payer, they are the receiver, or have access to the linked receipt.
router.get('/:id', async (req, res) => {
    if(!accessHelper.check_payment_request_accessible(req.user.user_id, req.params.id)) res.sendStatus(401).json({msg: 'User must be the payer, receiver, or have access to a linked receipt.'});
    else {
        const payment_request = paymentRequestAPI.getPaymentRequestByID(req.params.id);
        if(!res.headersSent) res.sendStatus(200).json(JSON.stringify(payment_request));
    }
});

//update payment request with ID
//Authorization: If the payer, can toggle is_declined. If the receiver, can edit amount, deadline, and mark as paid. Paid on date automatically set when payment is verified.
router.post('/:id/update', [
    body("pay_by", "Pay by must be a valid date")
        .trim()
        .isDate()
        .escape()
        .optional({ nullable: true }),
    body("amount", "Amount must be greater than 0 and is limited to two decimals")
        .trim()
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .matches(/^\d+.{0,1}\d{0,2}$/)
        .escape()
        .optional({ nullable: true }),
    body("description", "description must be 250 characters max")
        .trim()
        .isLength({max: 250})
        .escape()
        .optional({ nullable: true }),
    body("is_declined", "is_declined must have a boolean value")
        .trim()
        .isBoolean()
        .escape()
        .optional({ nullable: true }),
    body("payment_is_confirmed", "payment_is_confirmed must have a boolean value")
        .trim()
        .isBoolean()
        .escape()
        .optional({ nullable: true }),
    async (req, res) => {
        const errors = validationResult(req);

        const payment_request = await paymentRequestAPI.getPaymentRequestByID(req.params.id);

        if(errors.isEmpty()) {
            const promises = [];
            if(req.user.user_id == payment_request.payer_id) {
                if(req.body.is_declined) promises.push(paymentRequestAPI.changePaymentRequest(req.params.id, "is_declined", req.body.is_declined));
            }
            else if(req.user.user_id == payment_request.receiver_id) {
                if(req.body.pay_by) promises.push(paymentRequestAPI.changePaymentRequest(req.params.id, "pay_by", req.body.pay_by));
                if(req.body.amount) promises.push(paymentRequestAPI.changePaymentRequest(req.params.id, "amount", req.body.amount));
                if(req.body.description) promises.push(paymentRequestAPI.changePaymentRequest(req.params.id, "description", req.body.description));
                if("payment_is_confirmed" in req.body) {
                    if(req.body.payment_is_confirmed) promises.push(paymentRequestAPI.changePaymentRequest(req.params.id, "paid_on", new Date()));
                    else promises.push(paymentRequestAPI.changePaymentRequest(req.params.id, "paid_on", null));
                }
            }
            else res.status(401).json({msg: 'User must be the payer or receiver to modify request'});

            Promise.all(promises).then(() => {if(!res.headersSent) res.sendStatus(200);})
        }
    }
]);

//delete payment request with ID
//Authorization: Must be the receiver.
router.post('/:id/delete', async (req, res) => {
    const payment_request = await paymentRequestAPI.getPaymentRequestByID(req.params.id);
    if(payment_request.paid_on != null) res.status(400).json({msg: 'Already paid payment requests cannot be deleted'});
    else if(req.user.user_id != payment_request.receiver_id) res.status(401).json({msg: 'User must be the receiver to delete request'});
    else {
        await paymentRequestAPI.deletePaymentRequest(req.params.id);
        if(!res.headersSent) res.status(200).json(payment_request);
    }
});

module.exports = router;