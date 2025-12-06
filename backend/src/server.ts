import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Error handling middleware
app.use(
	(
		err: any,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction
	) => {
		console.error('Error:', err);
		res.status(err.status || 500).json({
			success: false,
			message: err.message || 'Internal server error',
		});
	}
);

// Initialize database and start server
async function startServer() {
	try {
		const MONGODB_URI =
			process.env.MONGODB_URI || 'mongodb://localhost:27017/devfolio';

		// Connect to MongoDB
		await mongoose.connect(MONGODB_URI);
		console.log('✓ Connected to MongoDB');

		const PORT = process.env.PORT || 4000;
		app.listen(PORT, () => {
			console.log(`✓ Server running on http://localhost:${PORT}`);
			console.log(`✓ API endpoints available at http://localhost:${PORT}/api`);
		});
	} catch (error) {
		console.error('✗ Failed to start server:', error);
		process.exit(1);
	}
}

startServer();
