import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

router.post('/saveItem', async (req, res) => {
    try {
        const { item } = req.body;

        if (!item) {
            return res.status(400).json({ message: 'Item content is required'});
        }

       // Get the items with same receipt_id from the database
       const itemQuery = 'SELECT * FROM items WHERE receipt_id = ?';
       const itemParams = [item.receipt_id];
       
       // Check if the item already exists
       const getInfo = await connection.execute(itemQuery, itemParams);
       const exist = getInfo[0].length > 0;
       
        if(exist){
           // Throw an error if the receipt already exists
           throw new Error("Item already exist");
        }

        // Execute the query to insert the new item into the database
        const query = 'INSERT INTO items (receipt_id, item_name, item_price, item_payee) VALUES (?, ?, ?, ?)';
        const params = [item.receipt_id, 
            item.name, 
            item.price,
            item.payee];
        await connection.execute(query, params);

        res.status(201).json({ message: 'Item saved successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the Item' });
    }
});

export default router;