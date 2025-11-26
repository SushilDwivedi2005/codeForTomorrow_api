import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';


dotenv.config();
connectDB();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/api",authRoutes);

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})