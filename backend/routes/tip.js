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
    const tips = accessHelper.get_accessible_tips(req.user);
    if(!res.headersSent) res.sendStatus(200).json(JSON.stringify(tips));
});

//create a new tip
//Authorization: Must have access to the receipt that the tip is assigned to. 
router.post('/add', [
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
    body("amount", "Amount must be greater than 0 and is limited to 2 decimal places")
        .trim()
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .matches(/^\d+.{0,1}\d{0,2}$/)
        .escape(),
    async (req, res) => {
      const errors = validationResult(req);

      const tip = new Tip({
        receipt_id: req.body.receipt_id,
        name: req.body.name,
        amount: req.body.amount
      });
  
      if (errors.isEmpty()) {
        await tipAPI.addTip(tip);
        res.sendStatus(200).json(JSON.stringify(tip));
      }
    }
]);

//get information of tip with ID    
//Authorization: Must have access to the receipt that the tip is assigned to.
router.get('/:id', async (req, res) => {
    if(!accessHelper.check_tip_accesible(req.user, req.params.id)) {
        res.sendStatus(401).json({msg: 'User must have access to the receipt that the tip is assigned to'});
    }
    else {
        const tip = tipAPI.getTipById(req.params.id);
        if (!tip) {
            return res.status(404).json({ msg: 'Tip not found.' });
        }
        res.sendStatus(200).json(JSON.stringify(tip));
    }
});

//update tip with ID
//Authorization: Must be an admin of the receipt
router.put('/:id/update', [
    body("name", "name must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("amount", "amount must be greater than 0")
        .trim()
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .matches(/^\d+.{0,1}\d{0,2}$/)
        .escape(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const tip = tipAPI.getTipById(req.params.id);
      if (!tip) {
        return res.status(404).json({ msg: 'Tip not found.' });
      }


        const receipt = await receiptAPI.getReceiptByID(tip.receipt_id);
        if (receipt.admin_id !== req.user) {
            return res.status(401).json({ msg: 'User must be admin of the receipt.' });
        }

        if (req.body.name) await tipAPI.changeTip(req.params.id, "name", req.body.name);
        if (req.body.amount) await tipAPI.changeTip(req.params.id, "amount", req.body.amount);

        res.status(200).json(tip);
    }
]);

//delete tip with ID
//Authorization: Must be an admin of the receipt
router.delete('/:id/delete', async (req, res) => {
    const tip = await tipAPI.getTipById(req.params.id);
    if (!tip) {
        return res.status(404).json({ msg: 'Tip not found.' });
    }

    const receipt = await receiptAPI.getReceiptByID(tip.receipt_id);
    if (receipt.admin_id !== req.user) {
        return res.status(401).json({ msg: 'User must be an admin to delete a tip from the receipt.' });
    }

    await tipAPI.deleteTip(req.params.id);
    res.status(200).json({ msg: 'Tip deleted successfully.' });
});

module.exports = router;