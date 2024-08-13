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
    res.sendStatus(200).json(JSON.stringify(tips));
});

//create a new tip
//Authorization: Must have access to the receipt that the tip is assigned to. 
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
    body("amount", "Amount must be greater than 0 and is limited to 2 decimal places")
        .trim()
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .matches(/^\d+.{0,1}\d{0,2}$/)
        .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const tip = new Tip({
        receipt_id: req.body.receipt_id,
        name: req.body.name,
        amount: req.body.amount
      });
  
      if (errors.isEmpty()) {
        tipAPI.addTip(tip);
        
        res.sendStatus(200).json(JSON.stringify(tip));
      }
    }
]);

//get information of tip with ID
//Authorization: Must have access to the receipt that the tip is assigned to.
router.get('/:id', async (req, res) => {
    if(!accessHelper.check_tip_accesible(req.user, req.params.id)) res.sendStatus(401).json({msg: 'User must have access to the receipt that the tip is assigned to'});
    else {
        const tip = tipAPI.getTipById(req.params.id);
        res.sendStatus(200).json(JSON.stringify(tip));
    }
});

//update tip with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/update', [
    body("name", "name must be 100 characters max")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("amount", "amount must be greater than 0")
        .trim()
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .matches(/^\d+.{0,1}\d{0,2}$/)
        .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const tip = tipAPI.getTipById(req.params.id);

      if (errors.isEmpty()) {
        const receipt = receiptAPI.getReceiptByID(tip.receipt_id)
        if(receipt.admin_id != req.user) res.sendStatus(401).json({msg: 'User must be admin of the receipt.'});
        else {
            if(req.body.name) tipAPI.changeTip(req.params.id, "name", req.body.name);
            if(req.body.amount) tipAPI.changeTip(req.params.id, "amount", req.body.amount);
        }
        
        res.sendStatus(200).json(JSON.stringify(tip));
      }
    }
]);

//delete tip with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/delete', async (req, res) => {
    const tip = tipAPI.getTipById(req.params.id);
    const receipt = receiptAPI.getReceiptByID(tip.receipt_id)
    if(receipt.admin_id != req.user) res.sendStatus(401).json({msg: 'User must be an admin to delete a tip from the receipt'});
    else {
      tipAPI.deleteTip(req.params.id);
      res.sendStatus(200).json(JSON.stringify(tip));
    }
});

module.exports = router;