import mongoose from "mongoose"

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("connection is already established")
        return
    }
    if (!process.env.MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI , {})
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected successfully");
    } catch (error) {
       console.error("Database connection failed:", error);
       throw new Error("Failed to connect to database");
    }

}
export default dbConnect