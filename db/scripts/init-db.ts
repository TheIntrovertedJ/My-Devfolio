import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/devfolio';

/**
 * Initialize and connect to MongoDB database
 * Creates collections if they don't exist
 */
export async function initializeDatabase() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('✓ Connected to MongoDB');

		// Verify collections exist
		const db = mongoose.connection.db;
		const collections = await db?.listCollections().toArray();
		const collectionNames = collections?.map((c: any) => c.name) || [];

		console.log(
			`Found ${collectionNames.length} collections:`,
			collectionNames
		);

		return true;
	} catch (error) {
		console.error('✗ Database initialization failed:', error);
		throw error;
	}
}

/**
 * Check database connection status
 */
export async function checkConnection() {
	try {
		await mongoose.connect(MONGODB_URI);
		const admin = mongoose.connection.db?.admin();
		const status = await admin?.ping();
		console.log('✓ Database connection healthy');
		return status;
	} catch (error) {
		console.error('✗ Database connection failed:', error);
		throw error;
	}
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase() {
	try {
		await mongoose.disconnect();
		console.log('✓ Disconnected from MongoDB');
	} catch (error) {
		console.error('✗ Disconnection failed:', error);
		throw error;
	}
}
