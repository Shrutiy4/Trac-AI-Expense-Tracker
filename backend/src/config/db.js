import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Failed to connect to DB:",error);
    }
}

export default connectDB;