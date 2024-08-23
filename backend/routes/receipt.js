const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const Receipt = require("../class/receiptsClass.js");
const receiptAPI = require("../api/receiptsAPI.js");
const accessHelper = require('../helpers/access.js');

//get a list of receipts from all of the user's groups
//Authorization: Can only see receipts that are part of the user's groups.
router.get('/', async (req, res) => {
    const receipts = await accessHelper.get_accessible_receipts(req.user.user_id);
    if(!res.headersSent) res.status(200).json(receipts);
});

//create a new receipt
//Authorization: Must be a member of the group that the receipt will be added to. 
router.post('/add', [
    //TODO: Tax, tip, expense_rate, item handling
    //TODO: Custom validation for images
    body("group_id", "group_id must be defined")
        .trim()
        .escape(),
    body("images")
        .trim()
        .escape()
        .optional(),
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
        .escape()
        .optional(),
    body("vendor", "vendor must be 250 characters max")
        .trim()
        .isLength({max: 250})
        .escape()
        .optional(),
    async (req, res, next) => {
        const errors = validationResult(req);

        if(!accessHelper.check_group_accessible(req.user.user_id, req.body.group_id)) {
            res.status(401).json({msg: 'User must be a member of the group they link'});
        }

        const receipt = new Receipt(
            req.body.group_id,
            req.body.name,
            req.body.description,
            req.body.images,
            req.body.category,
            Date.now(),
            req.body.vendor
        );

        if (errors.isEmpty()) {
            await receiptAPI.addReceipt(receipt);
           
            
            if(!res.headersSent) res.status(200).json(receipt);
        }
    }
]);

//get information of receipt with ID
//Authorization: Must be a member of the group that the receipt is part of.
router.get('/:id', async (req, res) => {
    const receipt = await receiptAPI.getReceiptByID(req.params.id);
    const has_access = await accessHelper.check_group_accessible(req.user.user_id, receipt.group_id);
    if(!has_access) res.status(401).json({msg: 'User must be a member of the group to view receipt'});
    else if(!res.headersSent) res.status(200).json(receipt);
});

//update receipt with ID
//Authorization: Must be the admin of the receipt
router.post('/:id/update', [
    //TODO: Tax, tip, expense_rate, item handling
    //TODO: Custom validation for images
    body("images")
        .trim()
        .escape()
        .optional(),
    body("name", "name must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape()
        .optional(),
    body("description", "description must be 250 characters max")
        .trim()
        .isLength({max: 250})
        .escape()
        .optional(),
    //TODO: Comfirm validation for category
    body("category", "category must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape()
        .optional(),
    body("vendor", "vendor must be 250 characters max")
        .trim()
        .isLength({max: 250})
        .escape()
        .optional(),
    async (req, res, next) => {
        const errors = validationResult(req);
        const is_admin = await accessHelper.check_admin_of_group(req.params.id, req.user.user_id);
        if(!is_admin) res.status(401).json({msg: 'User must be an admin to update the receipt'});
        else if (errors.isEmpty()) {
            const promises = [];
            if(req.body.images) promises.push(receiptAPI.changeReceipt(req.params.id, "images", req.body.images));
            if(req.body.name) promises.push(receiptAPI.changeReceipt(req.params.id, "name", req.body.name));
            if(req.body.description) promises.push(receiptAPI.changeReceipt(req.params.id, "description", req.body.description));
            if(req.body.category) promises.push(receiptAPI.changeReceipt(req.params.id, "category", req.body.category));
            if(req.body.vendor) promises.push(receiptAPI.changeReceipt(req.params.id, "name", req.body.vendor));
            
            Promise.all(promises).then(() => {if(!res.headersSent) res.sendStatus(200);})
        }
    }
]);

//delete receipt with ID
//Authorization: Must be the admin of the receipt
router.post('/:id/delete', async (req, res) => {
    const is_admin = await accessHelper.check_admin_of_group(req.params.id, req.user.user_id);
    if(!is_admin) res.status(401).json({msg: 'User must be an admin to update the receipt'});
    else {
        const receipt = await receiptAPI.getReceiptByID(req.params.id);
        await receiptAPI.deleteReceipt(req.params.id);
        if(!res.headersSent) res.status(200).json(receipt);
    }
});

module.exports = router;