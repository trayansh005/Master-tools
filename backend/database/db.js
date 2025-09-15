import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

/**
 * connectToDB()
 * Establishes a connection to MongoDB using MONGO_URI from backend/.env
 * Reuses the existing connection if already connected.
 */
export async function connectToDB() {
	if (isConnected) {
		return mongoose.connection;
	}

	const uri = process.env.MONGO_URI;
	if (!uri) {
		throw new Error("MONGO_URI is not set in environment");
	}

	try {
		mongoose.set("strictQuery", true);
		const conn = await mongoose.connect(uri, {
			// mongoose v6+ ignores many legacy options; kept minimal
			dbName: process.env.MONGO_DB_NAME || undefined,
		});
		isConnected = true;
		console.log(`MongoDB connected: ${conn.connection.host} to ${conn.connection.name}`);
		return conn.connection;
	} catch (err) {
		console.error("MongoDB connection error:", err);
		throw err;
	}
}
