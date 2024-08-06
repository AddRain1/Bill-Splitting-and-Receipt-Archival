const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const paymentRequestAPI = require('../api/paymentRequestAPI');
const PaymentRequest = require('../class/paymentRequestClass');
const accessHelper = require('../helpers/access');

const Receipt = require('../api/receiptsAPI');

//get a list of payment requests 
//Authorization: Must be logged in. Can only see payment request if they are the payer, they are the receiver, or have access to the linked receipt.
router.get('/', async (req, res) => {
    const payment_request_list = await accessHelper.get_accessible_payment_requests();
    res.json(JSON.stringify(payment_request_list));
});

//create a new payment request
//Authorization: Must be logged in. Must have access to the receipt they optionally link. 
router.get('/add', [
    async (req, res) => {
        if(req.body.receipt_id && !accessHelper.check_receipt_accessible(req.user, req.body.receipt_id)) {
            res.sendStatus(401).json({msg: 'User must have access to the receipt they link.'});
        }
    },
    body("pay_by", "Pay by must be a valid date")
      .trim()
      .isDate()
      .escape()
      .optional({ nullable: true }),
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
    (req, res, next) => {
      const errors = validationResult(req);
      const payment_request = new PaymentRequest({
        name: req.body.name,
        price: req.body.price,
        number_in_stock: 0,
        image: req.body.image,
        types: req.body.types,
        weight: req.body.weight,
        height: req.body.height,
      });
  
      if (errors.isEmpty()) {
        paymentRequestAPI.addPaymentRequest(payment_request);
        
        res.sendStatus(200).json(JSON.stringify(payment_request));
      }
    }
  ]);

//get information of payment with ID
//Authorization: Must be logged in. Can only see payment request if they are the payer, they are the receiver, or have access to the linked receipt.
router.get('/:id', async (req, res) => {
    if(!accessHelper.check_payment_request_accessible(req.user, req.params.id)) res.sendStatus(401).json({msg: 'User must be the payer, receiver, or have access to a linked receipt.'});
    else {
        const payment_request = paymentRequestAPI.getPaymentRequestByID(req.params.id);
        res.sendStatus(200).json(JSON.stringify(payment_request));
    }
});

//update payment request with ID
//Authorization: If the payer, can toggle is_declined. If the receiver, can edit amount, deadline, and mark as paid. Paid on date automatically set when payment is verified.
router.get('/:id/update', [
    body("pay_by", "Pay by must be a valid date")
      .trim()
      .isDate()
      .escape()
      .optional({ nullable: true }),
    body("amount", "Amount must be greater than 0 and is limited to two decimals")
      .trim()
      .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
      .matches(/^\d+.{0,1}\d{0,2}$/)
      .escape(),
    body("description")
        .trim()
        .isLength({max: 250})
        .escape(),
    body("is_declined")
        .trim()
        .isBoolean()
        .escape(),
    async (req, res) => {
        const errors = validationResult(req);

        const payment_request = paymentRequestAPI.getPaymentRequestByID(req.params.id);

        if(errors.isEmpty()) {
            //TODO: Throw an error if a req.body is defined that the user doesn't have access to or isn't a property
            if(req.user == payment_request.payer_id) {
                if(req.body.is_declined) paymentRequestAPI.changePaymentRequest(req.params.id, "is_declined", req.body.is_declined);
                res.sendStatus(200).json(JSON.stringify(payment_request));
            }
            else if(req.user == payment_request.receiver_id) {
                if(req.body.pay_by) paymentRequestAPI.changePaymentRequest(req.params.id, "pay_by", req.body.pay_by);
                if(req.body.amount) paymentRequestAPI.changePaymentRequest(req.params.id, "amount", req.body.amount);
                if(req.body.description) paymentRequestAPI.changePaymentRequest(req.params.id, "pay_by", req.body.pay_by);
                res.sendStatus(200).json(JSON.stringify(payment_request));
            }
            else res.sendStatus(401).json({msg: 'User must be the payer or receiver to modify request'});
        }
    }
]);

//delete payment request with ID
//Authorization: Must be the receiver.
router.get('/:id/delete', async (req, res) => {
    const payment_request = paymentRequestAPI.getPaymentRequestByID(req.params.id);
    if(req.user != payment_request.receiver_id) res.sendStatus(401).json({msg: 'User must be the receiver to delete request'});
    else {
        paymentRequestAPI.deletePaymentRequest(req.params.id);
        res.sendStatus(200).json(JSON.stringify(payment_request));
    }
});

module.exports = router;