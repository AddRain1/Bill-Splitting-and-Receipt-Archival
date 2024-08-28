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
    if(req.query.receipt_id){
      const query = `SELECT * FROM items WHERE receipt_id = ${req.query.receipt_id}`;
      const items = await itemAPI.getItemByQuery(query)
      if (!res.headersSent) res.status(200).json(JSON.stringify(items));
    }
    else if(req.query.user_id){
      const query = `SELECT * FROM items WHERE user_id = ${req.query.user_id}`;
      const items = await itemAPI.getItemByQuery(query)
      if (!res.headersSent) res.status(200).json(JSON.stringify(items));
    }
    else if(req.query.name){
      const query = `SELECT * FROM items WHERE name LIKE '%${req.query.name}%'`;
      const items = await itemAPI.getItemByQuery(query)
      if (!res.headersSent) res.status(200).json(JSON.stringify(items));
    }
    else if(req.query.price){
      const query = `SELECT * FROM items WHERE price = ${req.query.price}`;
      const items = await itemAPI.getItemByQuery(query)
      if (!res.headersSent) res.status(200).json(JSON.stringify(items));
    }
    else{
      const items = await itemAPI.getItems();
      if (!res.headersSent) res.status(200).json(items);
    }
    
});

//create a new item
//Authorization: Must have access to the receipt that the item is assigned to. 
router.post('/add', [
    async (req, res, next) => {
      //receipt must exist
      //user must have access to receipt
      if(!accessHelper.check_receipt_accessible(req.user.user_id, req.body.receipt_id)) {
          res.status(401).json({msg: 'User must have access to the receipt they link.'});
      }
      const receipt = await receiptAPI.getReceiptByID(req.body.receipt_id);
      //payee must be part of the group
      if(!accessHelper.check_group_accessible(req.body.payee, receipt.group_id)) {
        res.status(401).json({msg: 'Payee must be part of the group the item is assigned to'});
      } 
      next();
    },
    body("name")
        .trim()
        .isLength({max: 100})
        .escape(),
    body("price", "Price must be greater than 0 and is limited to two decimals")
        .trim()
        .isFloat({min: 0.01})
        .matches(/^\d+.{0,1}\d{0,2}$/)
        .escape(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Validation failed:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const item = new Item(
        null,
        req.body.receipt_id,
        req.body.name,
        req.body.price,
        req.body.payee,
        null
      );
  
      try {
        await itemAPI.addItem(item);
        if (!res.headersSent) res.status(201).json(item);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to add item' });
      }
      
    }
]);

//get information of item with ID
//Authorization: Must have access to the receipt that the item is assigned to.
router.get('/:id', async (req, res) => {
  const item = await itemAPI.getItemByID(req.params.id);
  if(!accessHelper.check_receipt_accessible(req.user.user_id, item.receipt_id)) res.status(401).json({msg: 'User must have access to the linked receipt.'});
  else if (!res.headersSent) res.status(200).json(JSON.stringify(item)); 
});

//update item with ID
//Authorization: Must be an admin of the receipt
router.put('/:id/update', [
  body("name")
      .trim()
      .isLength({max: 100})
      .escape()
      .optional(),
  body("price", "Price must be greater than 0 and is limited to two decimals")
      .trim()
      .isFloat({min: 0.01, max: Number.MAX_SAFE_INTEGER})
      .matches(/^\d+.{0,1}\d{0,2}$/)
      .escape()
      .optional(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    else if (errors.isEmpty()) {
      const promises = [];
      const item = await itemAPI.getItemByID(req.params.id);
      
      const receipt = await receiptAPI.getReceiptByID(item.receipt_id)
      if(receipt.admin_id == req.user.user_id) {
      if(req.body.receipt_id && !accessHelper.check_receipt_accessible(req.user.user_id, req.body.receipt_id)) res.status(401).json({msg: 'User must have access to the receipt they link.'});
      else if (req.body.receipt_id) promises.push(itemAPI.changeItem(req.params.id, "receipt_id", req.body.receipt_id));
      if (req.body.name) promises.push(itemAPI.changeItem(req.params.id, "name", req.body.name));
      if (req.body.price) promises.push(itemAPI.changeItem(req.params.id, "price", req.body.price));
      if (req.body.payee) promises.push(itemAPI.changeItem(req.params.id, "payee", req.body.payee));
      }
      else res.status(401).json({msg: 'User be an admin to the receipt linked to this item'}); 
    
      await Promise.all(promises);
      const updatedItem = await itemAPI.getItemByID(req.params.id);
  
      if(!res.headersSent) res.status(200).json(updatedItem);
    
    }
  }
]);

//delete item with ID
//Authorization: Must be an admin of the receipt
router.delete('/:id/delete', async (req, res) => {
    const item = await itemAPI.getItemByID(req.params.id);
    const receipt = await receiptAPI.getReceiptByID(item.receipt_id)
    if(receipt.admin_id != req.user.user_id) res.status(401).json({msg: 'User must be an admin to delete an item from the receipt'});
    else {
      await itemAPI.deleteItem(req.params.id);
      if (!res.headersSent) res.status(200).json('Item deleted successfully.');
    }
});

module.exports = router;