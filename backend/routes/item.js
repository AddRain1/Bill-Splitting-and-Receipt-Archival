const express = require('express');
const { body, validationResult } = require("express-validator");
const router = express.Router();

const itemAPI = require('../api/itemAPI');
const Item = require('../class/itemClass');
const accessHelper = require('../helpers/access');

const receiptAPI = require('../api/receiptsAPI');

//get a list of items assigned to the user
//Authorization: Must be logged in.
router.get('/', async (req, res) => {
    const items = itemAPI.getItems();
    res.sendStatus(200).json(JSON.stringify(items));
});

//create a new item
//Authorization: Must have access to the receipt that the item is assigned to. 
router.get('/add', [
    async (req, res) => {
      //receipt must exist
      //user must have access to receipt
      if(!accessHelper.check_receipt_accessible(req.user, req.body.receipt_id)) {
          res.sendStatus(401).json({msg: 'User must have access to the receipt they link.'});
      }
      const receipt = receiptAPI.getReceiptByID(req.body.receipt_id);
      //payee must be part of the group
      if(!accessHelper.check_group_accessible(req.body.payee, receipt.group_id)) {
        res.sendStatus(401).json({msg: 'Payee must be part of the group the item is assigned to'});
      }
    },
    body("name")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("price", "Price must be greater than 0 and is limited to two decimals")
        .trim()
        .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
        .matches(/^\d+.{0,1}\d{0,2}$/)
        .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      const item = new Item({
        receipt_id: req.body.receipt_id,
        name: req.body.name,
        price: req.body.price,
        payee: req.body.payee,
      });
  
      if (errors.isEmpty()) {
        itemAPI.addItem(item);
        
        res.sendStatus(200).json(JSON.stringify(item));
      }
    }
  ]);

//get information of item with ID
//Authorization: Must have access to the receipt that the item is assigned to.
router.get('/:id', async (req, res) => {
  const item = itemAPI.getItemById(req.params.id);
  if(!accessHelper.check_receipt_accessible(req.user, item.receipt_id)) res.sendStatus(401).json({msg: 'User must have access to the linked receipt.'});
  else res.sendStatus(200).json(JSON.stringify(item));
});

//update item with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/update', [
  body("name")
      .trim()
      .isLength({max: 100})
      .escape(),
  body("price", "Price must be greater than 0 and is limited to two decimals")
      .trim()
      .isInt({min: 0.01, max: Number.MAX_SAFE_INTEGER})
      .matches(/^\d+.{0,1}\d{0,2}$/)
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const item = itemAPI.getItemById(req.params.id);
      const receipt = receiptAPI.getReceiptByID(item.receipt_id)
      if(receipt.admin_id == req.user) {
        if(req.body.receipt_id && !accessHelper.check_receipt_accessible(req.user, req.body.receipt_id)) res.sendStatus(401).json({msg: 'User must have access to the receipt they link.'});
        else if(req.body.receipt_id) itemAPI.changeItem(req.params.id, "receipt_id", req.body.receipt_id);

        if(req.body.name) itemAPI.changeItem(req.params.id, "name", req.body.name);
        if(req.body.price) itemAPI.changeItem(req.params.id, "price", req.body.price);

        if(req.body.payee) itemAPI.changeItem(req.params.id, "payee", req.body.price);

      }
      else res.sendStatus(401).json({msg: 'User be an admin to the receipt linked to this item'});
      
      res.sendStatus(200).json(JSON.stringify(item));
    }
  }
]);

//delete item with ID
//Authorization: Must be an admin of the receipt
router.get('/:id/delete', async (req, res) => {
    const item = itemAPI.getItemById(req.params.id);
    const receipt = receiptAPI.getReceiptByID(item.receipt_id)
    if(receipt.admin_id != req.user) res.sendStatus(401).json({msg: 'User must be an admin to delete an item from the receipt'});
    else {
      itemAPI.deleteItem(req.params.id);
      res.sendStatus(200).json(JSON.stringify(item));
    }
});

module.exports = router;