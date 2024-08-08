const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const taxAPI = require('../api/taxAPI');
const Tax = require('../class/taxClass');
const accessHelper = require('../helpers/access');

const receiptAPI = require('../api/receiptsAPI');

//get a list of taxes for the receipts that the user has access to.
//Authorization: Must be logged in.
router.get('/', async (req, res) => {
    const taxes = accessHelper.get_accessible_taxes(req.user);
    res.sendStatus(200).json(JSON.stringify(taxes));
});

//create a new tax
//Authorization: Must have access to the receipt that the tax is assigned to. 
router.get('/add', [
    async (req, res) => {
        //check if user has access to receipt
        if(!accessHelper.check_receipt_accessible(req.user, req.body.receipt_id)) {
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
      const tax = new Tax({
        receipt_id: req.body.receipt_id,
        name: req.body.name,
        percentage: req.body.percentage
      });
  
      if (errors.isEmpty()) {
        taxAPI.addTax(tax);
        res.sendStatus(200).json(JSON.stringify(tax));
      }
    }
]);

//get information of tax with ID
//Authorization: Must have access to the receipt that the tax is assigned to.
router.get('/:id', async (req, res) => {
    if(!accessHelper.check_tax_accesible(req.user, req.params.id)) res.sendStatus(401).json({msg: 'User must have access to the receipt that the tax is assigned to'});
    else {
        const tax = taxAPI.getTaxByID(req.params.id);
        res.sendStatus(200).json(JSON.stringify(tax));
    }
});

//update tax with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/update', [
    body("name", "name must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("percentage", "Percentage must be greater than 0")
        .trim()
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const tax = taxAPI.getTaxByID(req.params.id);

      if (errors.isEmpty()) {
        const receipt = receiptAPI.getReceiptByID(tax.receipt_id)
        if(receipt.admin_id != req.user) res.sendStatus(401).json({msg: 'User must be admin of the receipt.'});
        else {
            if(req.body.name) taxAPI.changeTax(req.params.id, "name", req.body.name);
            if(req.body.percentage) taxAPI.changeTax(req.params.id, "percentage", req.body.percentage);
        }
        
        res.sendStatus(200).json(JSON.stringify(tax));
      }
    }
]);

//delete tax with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/delete', async (req, res) => {
    const tax = taxAPI.getTaxByID(req.params.id);
    const receipt = receiptAPI.getReceiptByID(tax.receipt_id)
    if(receipt.admin_id != req.user) res.sendStatus(401).json({msg: 'User must be an admin to delete a tax from the receipt'});
    else {
      taxAPI.deleteTax(req.params.id);
      res.sendStatus(200).json(JSON.stringify(tax));
    }
});

module.exports = router;