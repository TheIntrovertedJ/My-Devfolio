import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config();

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/devfolio';
const BACKUP_DIR = path.join(__dirname, '../backups');

/**
 * Create a backup of all collections to JSON files
 */
export async function backupDatabase() {
	try {
		await mongoose.connect(MONGODB_URI);
		const db = mongoose.connection.db;

		// Create backup directory if it doesn't exist
		if (!fs.existsSync(BACKUP_DIR)) {
			fs.mkdirSync(BACKUP_DIR, { recursive: true });
		}

		// Get all collections
		const collections = await db?.listCollections().toArray();
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);

		if (!fs.existsSync(backupPath)) {
			fs.mkdirSync(backupPath, { recursive: true });
		}

		// Backup each collection
		for (const collection of collections || []) {
			const data = await db?.collection(collection.name).find({}).toArray();
			const filePath = path.join(backupPath, `${collection.name}.json`);
			fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
			console.log(`✓ Backed up collection: ${collection.name}`);
		}

		console.log(`✓ Backup complete: ${backupPath}`);
	} catch (error) {
		console.error('✗ Backup failed:', error);
		throw error;
	}
}

/**
 * Restore database from a backup directory
 */
export async function restoreDatabase(backupPath: string) {
	try {
		if (!fs.existsSync(backupPath)) {
			throw new Error(`Backup path not found: ${backupPath}`);
		}

		await mongoose.connect(MONGODB_URI);
		const db = mongoose.connection.db;

		const files = fs
			.readdirSync(backupPath)
			.filter((f: string) => f.endsWith('.json'));

		for (const file of files) {
			const collectionName = file.replace('.json', '');
			const filePath = path.join(backupPath, file);
			const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

			// Drop existing collection
			try {
				await db?.dropCollection(collectionName);
			} catch {
				// Collection might not exist
			}

			// Insert data
			if (data.length > 0) {
				await db?.collection(collectionName).insertMany(data);
			}
			console.log(`✓ Restored collection: ${collectionName}`);
		}

		console.log('✓ Restore complete');
	} catch (error) {
		console.error('✗ Restore failed:', error);
		throw error;
	}
}

// Run if called directly
if (require.main === module) {
	const action = process.argv[2];
	const backupPath = process.argv[3];

	if (action === 'backup') {
		backupDatabase()
			.then(() => process.exit(0))
			.catch(() => process.exit(1));
	} else if (action === 'restore' && backupPath) {
		restoreDatabase(backupPath)
			.then(() => process.exit(0))
			.catch(() => process.exit(1));
	} else {
		console.log('Usage:');
		console.log('  npm run backup');
		console.log('  npm run restore <backup-path>');
		process.exit(1);
	}
}
