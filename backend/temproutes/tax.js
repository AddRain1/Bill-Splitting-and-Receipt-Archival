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

router.post('/saveTax', async (req, res) => {
    try {
        const { tax } = req.body;

        if (!tax) {
            return res.status(400).json({ message: 'Tax content is required'});
        }

        const taxQuery = 'SELECT * FROM taxes WHERE receipt_id = ?';
        const taxParams = [tax.receipt_id];
        
        // Check if the receipt already exists
        const getInfo = await connection.execute(taxQuery, taxParams);
        const exist = getInfo[0].length > 0;
        
        if(exist){
            // Throw an error if the receipt already exists
            throw new Error("tax already exist");
        }

        // Execute the query to insert the new receipt into the database
        const query = 'INSERT INTO taxes (receipt_id, tax_name, tax_percentage) VALUES (?, ?, ?)';
        const params = [tax.receipt_id, 
            tax.name, 
            tax.percentage];
        await connection.execute(query, params);

        res.status(201).json({ message: 'Tax saved successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving Tax' });
    }
});

export default router;