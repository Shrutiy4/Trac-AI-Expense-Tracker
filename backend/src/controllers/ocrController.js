import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';

dotenv.config();

export const ocrController = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const formData = new FormData();
    formData.append('document', file.buffer, file.originalname);

    const mindeeRes = await axios.post(
      'https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict',
      formData,
      {
        headers: {
          Authorization: `Token ${process.env.MINDEE_API_KEY}`,
          ...formData.getHeaders()  // important: sets multipart/form-data boundaries
        },
        responseType: 'json'
      }
    );

    res.json(mindeeRes.data);
  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Failed to process receipt' });
  }
};
