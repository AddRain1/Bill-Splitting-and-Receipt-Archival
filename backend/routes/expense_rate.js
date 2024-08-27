const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const expenseRateAPI = require("../api/expenseRateAPI.js");
const ExpenseRate = require('../class/expenseRateClass.js');
const receiptAPI = require('../api/receiptsAPI.js');
const accessHelper = require("../helpers/access.js");

//get a list of expense rates for the receipts that the user has access to.
//Authorization: Must be logged in.
router.get('/', async (req, res) => {
    if(req.query.receipt_id){
        const query = `WHERE receipt_id = ${req.query.receipt_id}`;
        const expense_rates = await expenseRateAPI.getExpenseRates(query);
        res.status(200).json(expense_rates);
    }
    else if(req.query.name){
        const query = `WHERE name LIKE '%${req.query.name}%'`;
        const expense_rates = await expenseRateAPI.getExpenseRates(query);
        res.status(200).json(expense_rates);
    }
    else if(req.query.percentage){
        const query = `WHERE percentage = ${req.query.percentage}`;
        const expense_rates = await expenseRateAPI.getExpenseRates(query);
        res.status(200).json(expense_rates);
    }
    else{
        const expense_rates = await accessHelper.get_accessible_expense_rates(req.user.user_id);
        if(!res.headersSent) res.status(200).json(expense_rates);
    }
});

//create a new expense rate
//Authorization: Must be admin to the receipt that the expense rate is assigned to. 
router.post('/add', [
    body("name")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("percentage", "Percentage must be a float and non-negative")
        .trim()
        .isFloat({min: 0})
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        const expense_rate = new ExpenseRate(
            req.body.receipt_id,
            req.body.name,
            parseFloat(req.body.percentage)
        );

        const receipt = await receiptAPI.getReceiptByID(req.body.receipt_id);
        if(req.user.user_id != receipt.admin_id) res.status(401).json({msg: 'User must be an admin to the receipt linked to the expense rate'});
        else if (errors.isEmpty()) {
            await expenseRateAPI.addExpenseRate(expense_rate);
            if(!res.headersSent) res.status(200).json(expense_rate);
        }
    }
]);

//get information of expense rate with ID
//Authorization: Must have access to the receipt that the expense rate is assigned to.
router.get('/:id', async (req, res) => {
    const expense_rate = await expenseRateAPI.getExpenseRateByID(req.params.id);

    if(!accessHelper.check_receipt_accessible(req.user.user_id, expense_rate.receipt_id)) res.status(401).json({msg: 'User must have access to the linked receipt.'});
    else {
        const expense_rate = await expenseRateAPI.getExpenseRateByID(req.params.id);
        if(!res.headersSent) res.status(200).json(expense_rate);
    }
});

//update expense rate with ID
//Authorization: Must be an admin of the receipt
router.post('/:id/update', [
    body("name")
        .trim()
        .isLength({max: 100})
        .escape()
        .optional(),
    body("percentage", "Percentage must be greater than 0")
        .trim()
        .isFloat({min: 0})
        .escape()
        .optional(),
    async (req, res, next) => {
        const errors = validationResult(req);

        const expense_rate = await expenseRateAPI.getExpenseRateByID(req.params.id);
        const receipt = await receiptAPI.getReceiptByID(expense_rate.receipt_id);

        if(req.user.user_id != receipt.admin_id) res.status(401).json({msg: 'User must be an admin to the receipt linked to the expense rate to update it.'});
        else if (errors.isEmpty()) {
            const promises = [];
            if(req.body.name) promises.push(expenseRateAPI.changeExpenseRate(req.params.id, "name", req.body.name));
            if(req.body.percentage) promises.push(expenseRateAPI.changeExpenseRate(req.params.id, "percentage", parseFloat(req.body.percentage)));
            
            Promise.all(promises).then(() => {if(!res.headersSent) res.sendStatus(200);})
        }
    }
]);

//delete expense rate with ID
//Authorization: Must be an admin of the receipt
router.post('/:id/delete', async (req, res) => {
    const expense_rate = await expenseRateAPI.getExpenseRateByID(req.params.id);
    const receipt = await receiptAPI.getReceiptByID(expense_rate.receipt_id);

    if(req.user.user_id != receipt.admin_id) res.status(401).json({msg: 'User must be an admin to the receipt linked to the expense rate to delete it.'});
    else {
        await expenseRateAPI.deleteExpenseRate(req.params.id);
        if(!res.headersSent) res.status(200).json(expense_rate);
    }
});

module.exports = router;