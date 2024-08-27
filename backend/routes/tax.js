const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const taxTable_api = require('../api/taxAPI.js');
const Tax = require('../class/taxClass');
const accessHelper = require('../helpers/access');

// const receiptAPI = require('../api/receiptsAPI');

//get a list of taxes for the receipts that the user has access to.
//Authorization: Must be logged in.
router.get('/', async (req, res) => {
    const taxes = accessHelper.get_accessible_taxes(req.user.user_id);
    if (!res.headersSent) res.status(200).json(JSON.stringify(taxes));
});

//create a new tax
//Authorization: Must have access to the receipt that the tax is assigned to. 
router.get('/add', [
    async (req, res) => {
        //check if user has access to receipt
        if(!accessHelper.check_receipt_accessible(req.user.user_id, req.body.receipt_id)) {
            res.status(401).json({msg: 'User must have access to the receipt they link.'});
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
    async (req, res) => {
      const errors = validationResult(req);
      const tax = new Tax({
        receipt_id: req.body.receipt_id,
        name: req.body.name,
        percentage: req.body.percentage
      });
  
      if (errors.isEmpty()) {
        await taxTable_api.addTax(tax);
        if (!res.headersSent) res.status(200).json(JSON.stringify(tax));
      }
    }
]);

//get information of tax with ID
//Authorization: Must have access to the receipt that the tax is assigned to.
router.get('/:id', async (req, res) => {
    if(!accessHelper.check_tax_accesible(req.user.user_id, req.params.id)) res.status(401).json({msg: 'User must have access to the receipt that the tax is assigned to'});
    else {
        const tax = await taxTable_api.getTaxByID(req.params.id);
        if (!res.headersSent) res.status(200).json(JSON.stringify(tax));
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
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .escape()
        .optional(),
    async (req, res) => {
      const errors = validationResult(req);
      const tax = await taxTable_api.getTaxByID(req.params.id);

      if (errors.isEmpty()) {
        const promises = [];
        const receipt = await receiptAPI.getReceiptByID(tax.receipt_id)
        /* if(receipt.admin_id != req.user.user_id) res.status(401).json({msg: 'User must be admin of the receipt.'});
        else {
            if(req.body.name) promises.push(taxTable_api.changeTax(req.params.id, "name", req.body.name));
            if(req.body.percentage) promises.push(taxTable_api.changeTax(req.params.id, "percentage", req.body.percentage));
        } */
        if(req.body.name) promises.push(taxTable_api.changeTax(req.params.id, "name", req.body.name));
        if(req.body.percentage) promises.push(taxTable_api.changeTax(req.params.id, "percentage", req.body.percentage));
        
        Promise.all(promises).then(() => {if(!res.headersSent) res.status(200).json(JSON.stringify(tax));})
      }
    }
]);

//delete tax with ID
//Authorization: Must be an admin of the receipt
router.delete('/:id/delete', async (req, res) => {
    const tax = await taxTable_api.getTaxByID(req.params.id);
    const receipt = await receiptAPI.getReceiptByID(tax.receipt_id)
    /*if(receipt.admin_id != req.user.user_id) res.status(401).json({msg: 'User must be an admin to delete a tax from the receipt'});
    else {
      await taxTable_api.deleteTax(req.params.id);
      if (!res.headersSent) res.status(200).json(JSON.stringify('Tax successfully deleted.'));
    } */
    await taxTable_api.deleteTax(req.params.id);
    if (!res.headersSent) res.status(200).json(JSON.stringify('Tax successfully deleted.'));
});

module.exports = router;