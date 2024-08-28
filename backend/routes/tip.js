const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const tipAPI = require('../api/tipAPI');
const Tip = require('../class/tipClass');
const accessHelper = require('../helpers/access');

const receiptAPI = require('../api/receiptsAPI');

//get a list of tips for the receipts that the user has access to.
//Authorization: Must be logged in.
router.get('/', async (req, res) => {
    const tips = accessHelper.get_accessible_tips(req.user.user_id);
    if (!res.headersSent) res.status(200).json(tips);
});

//create a new tip
//Authorization: Must have access to the receipt that the tip is assigned to. 
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
    body("amount", "Amount must be greater than 0 and is limited to 2 decimal places")
        .trim()
        .isFloat({min: 0.01})   
        .escape(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const tip = new Tip(
            req.body.tip_id,
            req.body.receipt_id,
            req.body.amount
        );

        try {
            await tipAPI.addTip(tip);
            return res.status(201).json(tip);
        } catch (err) {
            console.error('Error adding tip:', err);
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    }
]);

//get information of tip with ID    
//Authorization: Must have access to the receipt that the tip is assigned to.
router.get('/:id', async (req, res) => {
    try {
        if (!accessHelper.check_tip_accesible(req.user.user_id, req.params.id)) {
            return res.status(401).json({ msg: 'User must have access to the receipt that the tip is assigned to' });
        }

        const tip = await tipAPI.getTipByID(req.params.id);
        if (!tip) {
            return res.status(404).json({ msg: 'Tip not found.' });
        }

        res.status(200).json(tip);
    } catch (error) {
        console.error('Error fetching tip:', error); // Print the error message to the console
        res.status(500).json({ msg: 'Internal Server Error' });
    }
});

//update tip with ID
//Authorization: Must be an admin of the receipt
router.put('/:id/update', [
    body("name", "name must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape()
        .optional(),
    body("amount", "amount must be greater than 0")
        .trim()
        .isFloat({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .escape()
        .optional(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const tip = await tipAPI.getTipByID(req.params.id);
        if (!tip) {
            return res.status(404).json({ msg: 'Tip not found.' });
        }
        const receipt = await receiptAPI.getReceiptByID(tip.receipt_id);
        if (receipt.admin_id !== req.user.user_id) {
            return res.status(401).json({ msg: 'User must be admin of the receipt.' });
        }
        const promises = [];

        if (req.body.amount) promises.push(tipAPI.changeTip(req.params.id, "amount", req.body.amount));

        await Promise.all(promises);
        const updatedTip = await tipAPI.getTipByID(req.params.id);
        if(!res.headersSent) res.status(200).json(updatedTip);
    }
]);

//delete tip with ID
//Authorization: Must be an admin of the receipt
router.delete('/:id/delete', async (req, res) => {
    const tip = await tipAPI.getTipByID(req.params.id);
    if (!tip) {
        return res.status(404).json({ msg: 'Tip not found.' });
    }

    const receipt = await receiptAPI.getReceiptByID(tip.receipt_id);
    if (receipt.admin_id !== req.user.user_id) {
        return res.status(401).json({ msg: 'User must be an admin to delete a tip from the receipt.' });
    } 

    await tipAPI.deleteTip(req.params.id);
    if (!res.headersSent) res.status(200).json('Tip deleted successfully.');
});

module.exports = router;