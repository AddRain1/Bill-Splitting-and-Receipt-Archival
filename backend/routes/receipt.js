const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const Receipt = require("../class/receiptsClass.js");
const receiptAPI = require("../api/receiptsAPI.js");
const accessHelper = require('../helpers/access.js');

//get a list of receipts from all of the user's groups
//Authorization: Can only see receipts that are part of the user's groups.
router.get('/', async (req, res) => {
    const receipts = accessHelper.get_accessible_receipts(req.user);
    res.sendStatus(200).json(JSON.stringify(receipts));
});

//create a new receipt
//Authorization: Must be a member of the group that the receipt will be added to. 
router.get('/add', [
    //TODO: Tax, tip, expense_rate, item handling
    //TODO: Custom validation for images
    body("images")
        .trim()
        .escape(),
    body("name", "name must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("description", "description must be 250 characters max")
        .trim()
        .isLength({max: 250})
        .escape(),
    //TODO: Comfirm validation for category
    body("category", "category must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("vendor", "vendor must be 250 characters max")
        .trim()
        .isLength({max: 250})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!accessHelper.check_group_accessible(req.user, req.body.group_id)) {
            res.sendStatus(401).json({msg: 'User must be a member of the group they link'});
        }

        const receipt = new Receipt({
            group_id: req.body.group_id,
            images: req.body.images,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            vendor: req.body.vendor
        });

        if (errors.isEmpty()) {
            receiptAPI.addReceipt(receipt);
            
            res.sendStatus(200).json(JSON.stringify(receipt));
        }
    }
]);

//get information of receipt with ID
//Authorization: Must be a member of the group that the receipt is part of.
router.get('/:id', async (req, res) => {
    const receipt = receiptAPI.getReceiptByID(req.params.id);
    if(!accessHelper.check_group_accessible(req.user, req.body.group_id)) {
        res.sendStatus(401).json({msg: 'User must be a member of the group they link'});
    }
    else res.sendStatus(200).json(JSON.stringify(receipt));
});

//update receipt with ID
//Authorization: Must be the admin of the receipt
router.get('/:id/update', [
    //TODO: Tax, tip, expense_rate, item handling
    //TODO: Custom validation for images
    body("images")
        .trim()
        .escape(),
    body("name", "name must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("description", "description must be 250 characters max")
        .trim()
        .isLength({max: 250})
        .escape(),
    //TODO: Comfirm validation for category
    body("category", "category must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("vendor", "vendor must be 250 characters max")
        .trim()
        .isLength({max: 250})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const receipt = new Receipt({
            images: req.body.images,
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            vendor: req.body.vendor
        });

        if (errors.isEmpty()) {
            if(req.body.images) receiptAPI.changeReceipt(req.params.id, "images", req.body.images);
            if(req.body.name) receiptAPI.changeReceipt(req.params.id, "name", req.body.name);
            if(req.body.description) receiptAPI.changeReceipt(req.params.id, "description", req.body.description);
            if(req.body.category) receiptAPI.changeReceipt(req.params.id, "category", req.body.category);
            if(req.body.vendor) receiptAPI.changeReceipt(req.params.id, "name", req.body.vendor);
            
            res.sendStatus(200).json(JSON.stringify(receipt));
        }
    }
]);

//delete receipt with ID
//Authorization: Must be the admin of the receipt
router.get('/:id/delete', async (req, res) => {
    const receipt = receiptAPI.getReceiptByID(req.params.id);
    if(receipt.admin_id != req.user) res.sendStatus(401).json({msg: 'User must be an admin to delete the receipt'});
    else {
        receiptAPI.deleteReceipt(req.params.id);
        res.sendStatus(200).json(JSON.stringify(receipt));
    }
});

module.exports = router;