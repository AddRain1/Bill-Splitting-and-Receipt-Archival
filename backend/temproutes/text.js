import express from 'express';
import receiptTable_api from '../src/receiptsAPI.js';

const router = express.Router();

router.post('/saveText', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Text content is required'});
        }

        await receiptTable_api.saveText(text);

        res.status(201).json({ message: 'Text saved successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the text' });
    }
});

export default router;