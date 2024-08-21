const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const expenseRateAPI = require("../api/expenseRateAPI.js");
const ExpenseRate = require('../class/expenseRateClass.js');
const accessHelper = require("../helpers/access.js");

//get a list of expense rates for the receipts that the user has access to.
//Authorization: Must be logged in.
router.get('/', async (req, res) => {
    if(req.query.receipt_id){
        const query = `WHERE receipt_id = ${req.query.receipt_id}`;
        const expense_rates = expenseRateAPI.getExpenseRate(query);
        res.sendStatus(200).json(JSON.stringify(expense_rates));
    }
    else if(req.query.name){
        const query = `WHERE name LIKE '%${req.query.name}%'`;
        const expense_rates = expenseRateAPI.getExpenseRate(query);
        res.sendStatus(200).json(JSON.stringify(expense_rates));
    }
    else if(req.query.percentage){
        const query = `WHERE percentage = ${req.query.percentage}`;
        const expense_rates = expenseRateAPI.getExpenseRate(query);
        res.sendStatus(200).json(JSON.stringify(expense_rates));
    }
    else{
        const expense_rates = accessHelper.get_accessible_expense_rates(req.user);
        res.json(JSON.stringify(expense_rates));
    }
});

//create a new expense rate
//Authorization: Must have access to the receipt that the expense rate is assigned to. 
router.get('/add', [
    async (req, res) => {
        if(req.body.receipt_id && !accessHelper.check_receipt_accessible(req.user, req.body.receipt_id)) {
            res.sendStatus(401).json({msg: 'User must have access to the receipt they link.'});
        }
    },
    body("name")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("percentage", "Percentage must be greater than 0")
        .trim()
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const expense_rate = new ExpenseRate({
            name: req.body.name,
            percentage: req.body.percentage
        });
    
        if (errors.isEmpty()) {
            expenseRateAPI.addExpenseRate(expense_rate);
            
            res.sendStatus(200).json(JSON.stringify(expense_rate));
        }
    }
]);

//get information of expense rate with ID
//Authorization: Must have access to the receipt that the expense rate is assigned to.
router.get('/:id', async (req, res) => {
    if(!accessHelper.check_receipt_accessible(req.user, req.params.receipt_id)) res.sendStatus(401).json({msg: 'User must have access to the linked receipt.'});
    else {
        const expense_rate = expenseRateAPI.getExpenseRate(req.params.id);
        res.sendStatus(200).json(JSON.stringify(expense_rate));
    }
});

//update expense rate with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/update', [
    async (req, res) => {
        if(req.body.receipt_id && !accessHelper.check_receipt_accessible(req.user, req.body.receipt_id)) {
            res.sendStatus(401).json({msg: 'User must have access to the receipt they link.'});
        }
    },
    body("name")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("percentage", "Percentage must be greater than 0")
        .trim()
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const expense_rate = expenseRateAPI.getExpenseRateByID();

        if (errors.isEmpty() && req.user == expense_rate.admin_id) {
            expenseRateAPI.changeExpenseRate()
            
            res.sendStatus(200).json(JSON.stringify(expense_rate));
        }
    }
]);

//delete expense rate with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/delete', async (req, res) => {
    const expense_rate = expenseRateAPI.getExpenseRateByID(req.params.id);
    if(req.user != expense_rate.admin_id) res.sendStatus(401).json({msg: 'User must be the admin of the receipt to delete expense rate'});
    else {
        expense_rate.deleteExpenseRate(req.params.id);
        res.sendStatus(200).json(JSON.stringify(expense_rate));
    }
});

module.exports = router;