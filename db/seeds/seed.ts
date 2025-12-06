import dotenv from 'dotenv';
import mongoose from 'mongoose';
import projectsData from '../seeds/projects.json';
import skillsData from '../seeds/skills.json';

dotenv.config();

const MONGODB_URI =
	process.env.MONGODB_URI || 'mongodb://localhost:27017/devfolio';

// Simple schema definitions for seeding
const projectSchema = new mongoose.Schema({
	title: String,
	description: String,
	url: String,
	imageUrl: String,
	tags: [String],
	featured: Boolean,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const skillSchema = new mongoose.Schema({
	name: String,
	category: String,
	proficiency: Number,
	createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model('Project', projectSchema);
const Skill = mongoose.model('Skill', skillSchema);

async function seedDatabase() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('Connected to MongoDB');

		// Clear existing data
		await Project.deleteMany({});
		await Skill.deleteMany({});
		console.log('Cleared existing data');

		// Seed projects
		await Project.insertMany(projectsData);
		console.log(`✓ Seeded ${projectsData.length} projects`);

		// Seed skills
		await Skill.insertMany(skillsData);
		console.log(`✓ Seeded ${skillsData.length} skills`);

		console.log('Database seeded successfully!');
		process.exit(0);
	} catch (error) {
		console.error('Error seeding database:', error);
		process.exit(1);
	}
}

seedDatabase();
