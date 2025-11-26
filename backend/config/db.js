import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGOURI=process.env.MONGOURI || 'mongodb://localhost:27017/CODE_FOR_TOMORROW';
const connectDB = async ()=>{
    await mongoose.connect(MONGOURI);
    console.log('MongoDB connected');
}

export default connectDB;