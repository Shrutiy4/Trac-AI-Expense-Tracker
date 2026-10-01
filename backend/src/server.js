import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import expenseRoutes from './routes/expenseRoutes.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import userSettingsRoutes from './routes/userSettingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import ocrRoutes from './routes/ocrRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin:"http://localhost:5173",
    }));
}

app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userSettingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/ocr', ocrRoutes);

app.use('/api/meta', metaRoutes);

app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);



if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
    });
}


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT: ${PORT}`);
    });
})