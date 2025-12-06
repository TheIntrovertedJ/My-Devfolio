import { Request, Response, Router } from 'express';
import { Skill } from '../models/Skill';

const router = Router();

/**
 * GET /api/skills
 * Fetch all skills with optional filtering
 * Query params: category (language|framework|tool|database|other)
 */
router.get('/', async (req: Request, res: Response) => {
	try {
		const { category } = req.query;
		const filter: any = {};

		if (category && typeof category === 'string') {
			filter.category = category;
		}

		const skills = await Skill.find(filter).sort({ category: 1, name: 1 });

		res.json({
			success: true,
			data: skills,
			count: skills.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch skills',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

/**
 * GET /api/skills/:id
 * Fetch a single skill by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const skill = await Skill.findById(req.params.id);

		if (!skill) {
			return res.status(404).json({
				success: false,
				message: 'Skill not found',
			});
		}

		res.json({
			success: true,
			data: skill,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch skill',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

/**
 * POST /api/skills
 * Create a new skill
 */
router.post('/', async (req: Request, res: Response) => {
	try {
		const { name, category, proficiency } = req.body;

		const newSkill = new Skill({
			name,
			category,
			proficiency,
		});

		await newSkill.save();

		res.status(201).json({
			success: true,
			message: 'Skill created successfully',
			data: newSkill,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: 'Failed to create skill',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

/**
 * PUT /api/skills/:id
 * Update a skill by ID
 */
router.put('/:id', async (req: Request, res: Response) => {
	try {
		const { name, category, proficiency } = req.body;

		const skill = await Skill.findByIdAndUpdate(
			req.params.id,
			{
				name,
				category,
				proficiency,
				updatedAt: new Date(),
			},
			{ new: true, runValidators: true }
		);

		if (!skill) {
			return res.status(404).json({
				success: false,
				message: 'Skill not found',
			});
		}

		res.json({
			success: true,
			message: 'Skill updated successfully',
			data: skill,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: 'Failed to update skill',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

/**
 * DELETE /api/skills/:id
 * Delete a skill by ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
	try {
		const skill = await Skill.findByIdAndDelete(req.params.id);

		if (!skill) {
			return res.status(404).json({
				success: false,
				message: 'Skill not found',
			});
		}

		res.json({
			success: true,
			message: 'Skill deleted successfully',
			data: skill,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to delete skill',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

export default router;
