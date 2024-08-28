const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const taxAPI = require('../api/taxAPI.js');
const Tax = require('../class/taxClass');
const accessHelper = require('../helpers/access');

const receiptAPI = require('../api/receiptsAPI');

//get a list of taxes for the receipts that the user has access to.
//Authorization: Must be logged in.
router.get('/', async (req, res) => {
    const taxes = await accessHelper.get_accessible_taxes(req.user.user_id);
    if (!res.headersSent) res.status(200).json(JSON.stringify(taxes));
});

//create a new tax
//Authorization: Must have access to the receipt that the tax is assigned to. 
router.post('/add', [
    async (req, res, next) => {
        //check if user has access to receipt
        if(!accessHelper.check_receipt_accessible(req.user.user_id, req.body.receipt_id)) {
            res.status(401).json({msg: 'User must have access to the receipt they link.'});
        }
       next();
    },
    body("name")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("percentage", "Percentage must be greater than 0")
        .trim()
        .isFloat({min: 0.01})
        .escape(),
    async (req, res) => {
      const errors = validationResult(req);
      const tax = new Tax(
        null,
        req.body.receipt_id,
        req.body.name,
        req.body.percentage
      );
      console.log('Adding this tax: ', tax);
      
      console.log('Errors: ', errors);
      if (errors.isEmpty()) {
        await taxAPI.addTax(tax);
        if (!res.headersSent) res.status(201).json(tax);
      }
    }
]);

//get information of tax with ID
//Authorization: Must have access to the receipt that the tax is assigned to.
router.get('/:id', async (req, res) => {
    try {
        const hasAccess = await accessHelper.check_tax_accessible(req.user.user_id, req.params.id);
        if (!hasAccess) {
            return res.status(401).json({ msg: 'User must have access to the receipt that the tax is assigned to' });
        } 
        console.log('Fetching tax with id: ', req.params.id);
        const tax = await taxAPI.getTaxByID(req.params.id);
        if (!res.headersSent) {
            return res.status(200).json(tax);
        }
    } catch (err) {
        console.error('Error fetching tax:', err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

//update tax with ID
//Authorization: Must be an admin of the receipt
router.put('/:id/update', [
    body("name", "name must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape()
        .optional(),
    body("percentage", "Percentage must be greater than 0")
        .trim()
        .isFloat({min: 0.01})
        .escape()
        .optional(),
    async (req, res) => {
        const errors = validationResult(req);
        console.log('Update, fetching tax with id: ', req.params.id);
        const tax = await taxAPI.getTaxByID(req.params.id);
        console.log('To update, found tax: ', tax);
        if (errors.isEmpty()) {
            const promises = [];
            const receipt = await receiptAPI.getReceiptByID(tax.receipt_id)
            if(receipt.admin_id != req.user.user_id) res.status(401).json({msg: 'User must be admin of the receipt.'});
            else {
                if(req.body.name) promises.push(taxAPI.changeTax(req.params.id, "name", req.body.name));
                if(req.body.percentage) promises.push(taxAPI.changeTax(req.params.id, "percentage", req.body.percentage));
            }
            
            await Promise.all(promises);

            const updatedTax = await taxAPI.getTaxByID(req.params.id);
            console.log('Updated tax: ', updatedTax);

            if(!res.headersSent) res.status(200).json(updatedTax);
        }
    }
]);

//delete tax with ID
//Authorization: Must be an admin of the receipt
router.delete('/:id/delete', async (req, res) => {
    const tax = await taxAPI.getTaxByID(req.params.id);
    const receipt = await receiptAPI.getReceiptByID(tax.receipt_id);
    if(receipt.admin_id != req.user.user_id) res.status(401).json({msg: 'User must be an admin to delete a tax from the receipt'});
    else {
        await taxAPI.deleteTax(req.params.id);
        if (!res.headersSent) res.status(200).json('Tax deleted successfully.');
    } 
});

module.exports = router;