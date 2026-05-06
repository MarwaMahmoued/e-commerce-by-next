import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ecommerce";

async function dbConnect() {

    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(MONGODB_URL);
        console.log(" DB is Connected Successfully");
    } catch (err) {
        console.log(" DB Connection Error:", err);
    }
}

export default dbConnect;