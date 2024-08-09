import express from 'express';
import receiptTable_api from '../src/receiptsAPI.js';

const router = express.Router();

router.post('/saveImage', async (req, res) => {
    try {
        const { title, imageData } = req.body;

        if (!imageData) {
            return res.status(400).json({ message: 'Image content is required'});
        }

        await receiptTable_api.saveImage(title, imageData);

        res.status(201).json({ message: 'Image saved successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while saving the image' });
    }
});

export default router;