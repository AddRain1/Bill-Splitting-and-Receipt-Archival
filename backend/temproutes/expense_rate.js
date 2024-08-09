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

router.post('/saveExpRate', async (req, res) => {
    try {
        const { expense_rate } = req.body;

        if (!expense_rate) {
            return res.status(400).json({ message: 'Text content is required'});
        }

        const ERQuery = 'SELECT * FROM expense_rate WHERE receipt_id = ?';
        const ERParams = [expense_rate.receipt_id];
        
        // Check if the expense rate with receipt_id already exists
        const getInfo = await connection.execute(ERQuery, ERParams);
        const exist = getInfo[0].length > 0;
        
        if(exist){
            // Throw an error if the expense rate already exists
            throw new Error("expense rate already exist");
        }

        res.status(201).json({ message: 'ExpRate saved successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the ExpRate' });
    }
});

export default router;