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

router.post('/saveTip', async (req, res) => {
    try {
        const { tip } = req.body;

        if (!tip) {
            return res.status(400).json({ message: 'Tip content is required'});
        }

        const tipQuery = 'SELECT * FROM tips WHERE receipt_id = ?';
        const tipParams = [tip.receipt_id];
        // Check if the receipt already exists
        const getInfo = await connection.execute(tipQuery, tipParams);
        const exist = getInfo[0].length > 0;
        
        if(exist){
            // Throw an error if the tip already exists
            throw new Error("tip already exist");
        }

        // Execute the query to insert the new tip into the database
        const query = 'INSERT INTO tips (receipt_id, tip_amount) VALUES (?, ?)';
        const params = [ tip.receipt_id, tip.amount];
        await connection.execute(query, params);

        res.status(201).json({ message: 'Tip saved successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving Tip' });
    }
});

export default router;