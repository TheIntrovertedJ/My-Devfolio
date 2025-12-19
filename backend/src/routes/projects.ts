import { Request, Response, Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Project } from '../models/Project';

const router = Router();

// Limit DELETE requests to maximum 5 per minute per IP to mitigate abuse
const deleteProjectLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 5, // limit each IP to 5 delete requests per 'window' (per minute)
	message: {
		success: false,
		message: 'Too many project deletions from this IP, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Limit PUT requests to maximum 10 per minute per IP to mitigate abuse
const putProjectLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 10, // limit each IP to 10 put requests per 'window' (per minute)
	message: {
		success: false,
		message: 'Too many project updates from this IP, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Limit GET-by-ID requests to maximum 20 per minute per IP to mitigate abuse
const getProjectByIdLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 20, // limit each IP to 20 get-by-id requests per 'window'
	message: {
		success: false,
		message: 'Too many requests for project details from this IP, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Limit GET-all-projects requests to maximum 20 per minute per IP to mitigate abuse
const getProjectsLimiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	max: 20, // limit each IP to 20 get-projects requests per 'window'
	message: {
		success: false,
		message: 'Too many requests for project list from this IP, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

/**
 * GET /api/projects
 * Fetch all projects with optional filtering
 * Query params: featured (boolean), tags (comma-separated)
 */
router.get('/', getProjectsLimiter, async (req: Request, res: Response) => {
	try {
		const { featured, tags } = req.query;
		const filter: any = {};

		if (featured === 'true') {
			filter.featured = true;
		}

		if (tags && typeof tags === 'string') {
			filter.tags = { $in: tags.split(',') };
		}

		const projects = await Project.find(filter).sort({ createdAt: -1 });
		res.json({
			success: true,
			data: projects,
			count: projects.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch projects',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

/**
 * GET /api/projects/:id
 * Fetch a single project by ID
 */
router.get('/:id', getProjectByIdLimiter, async (req: Request, res: Response) => {
	try {
		const project = await Project.findById(req.params.id);

		if (!project) {
			return res.status(404).json({
				success: false,
				message: 'Project not found',
			});
		}

		res.json({
			success: true,
			data: project,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch project',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

/**
 * POST /api/projects
 * Create a new project
 */
router.post('/', async (req: Request, res: Response) => {
	try {
		const { title, description, url, imageUrl, tags, featured } = req.body;

		const newProject = new Project({
			title,
			description,
			url,
			imageUrl,
			tags: tags || [],
			featured: featured || false,
		});

		await newProject.save();

		res.status(201).json({
			success: true,
			message: 'Project created successfully',
			data: newProject,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: 'Failed to create project',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

/**
 * PUT /api/projects/:id
 * Update a project by ID
 */
router.put('/:id', putProjectLimiter, async (req: Request, res: Response) => {
	try {
		const { title, description, url, imageUrl, tags, featured } = req.body;

		// Input validation and sanitization
		let updateObj: any = { updatedAt: new Date() };
		if (title !== undefined) {
			if (typeof title !== 'string') {
				return res.status(400).json({
					success: false,
					message: 'Invalid type for title.',
				});
			}
			updateObj.title = title;
		}
		if (description !== undefined) {
			if (typeof description !== 'string') {
				return res.status(400).json({
					success: false,
					message: 'Invalid type for description.',
				});
			}
			updateObj.description = description;
		}
		if (url !== undefined) {
			if (typeof url !== 'string') {
				return res.status(400).json({
					success: false,
					message: 'Invalid type for url.',
				});
			}
			updateObj.url = url;
		}
		if (imageUrl !== undefined) {
			if (typeof imageUrl !== 'string') {
				return res.status(400).json({
					success: false,
					message: 'Invalid type for imageUrl.',
				});
			}
			updateObj.imageUrl = imageUrl;
		}
		if (tags !== undefined) {
			if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string')) {
				return res.status(400).json({
					success: false,
					message: 'Invalid type for tags.',
				});
			}
			updateObj.tags = tags;
		}
		if (featured !== undefined) {
			if (typeof featured !== 'boolean') {
				return res.status(400).json({
					success: false,
					message: 'Invalid type for featured.',
				});
			}
			updateObj.featured = featured;
		}

		const project = await Project.findByIdAndUpdate(
			req.params.id,
			{ $set: updateObj },
			{ new: true, runValidators: true }
		);

		if (!project) {
			return res.status(404).json({
				success: false,
				message: 'Project not found',
			});
		}

		res.json({
			success: true,
			message: 'Project updated successfully',
			data: project,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: 'Failed to update project',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

/**
 * DELETE /api/projects/:id
 * Delete a project by ID
 */
router.delete(
	'/:id',
	deleteProjectLimiter,
	async (req: Request, res: Response) => {
		try {
			const project = await Project.findByIdAndDelete(req.params.id);

			if (!project) {
				return res.status(404).json({
					success: false,
					message: 'Project not found',
				});
			}

			res.json({
				success: true,
				message: 'Project deleted successfully',
				data: project,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: 'Failed to delete project',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	}
);

export default router;
