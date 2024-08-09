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

router.post('/saveReceipt', async (req, res) => {
    try {
        const { receipt } = req.body;

        if (!receipt) {
            return res.status(400).json({ message: 'Receipt content is required'});
        }

        const query = 'INSERT INTO receipts (receipt_id, group_id, images, receipt_name, receipt_description, receipt_category, vendor_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [receipt.receipt_id,
            receipt.group_id, 
            receipt.images, 
            receipt.name, 
            receipt.description, 
            receipt.category, 
            receipt.vendor];
        await connection.execute(query, params);

        res.status(201).json({ message: 'Receipt saved successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the receipt' });
    }
});

export default router;