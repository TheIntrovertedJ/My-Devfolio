import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/devfolio';

/**
 * Drop all collections and reset database
 * WARNING: This will delete ALL data in the database
 */
export async function resetDatabase() {
	try {
		await mongoose.connect(MONGODB_URI);
		const db = mongoose.connection.db;

		// Get all collections
		const collections = await db?.listCollections().toArray();

		if (!collections || collections.length === 0) {
			console.log('✓ Database is already empty');
			return;
		}

		// Drop each collection
		for (const collection of collections) {
			await db?.dropCollection(collection.name);
			console.log(`✓ Dropped collection: ${collection.name}`);
		}

		console.log('✓ Database reset complete');
	} catch (error) {
		console.error('✗ Database reset failed:', error);
		throw error;
	}
}

/**
 * Clear specific collection
 */
export async function clearCollection(collectionName: string) {
	try {
		await mongoose.connect(MONGODB_URI);
		const db = mongoose.connection.db;
		await db?.collection(collectionName).deleteMany({});
		console.log(`✓ Cleared collection: ${collectionName}`);
	} catch (error) {
		console.error(`✗ Failed to clear ${collectionName}:`, error);
		throw error;
	}
}

// Run if called directly
if (require.main === module) {
	resetDatabase()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}
