import { Router } from 'express';
import projectsRouter from './projects';
import skillsRouter from './skills';

const router = Router();

router.use('/projects', projectsRouter);
router.use('/skills', skillsRouter);

export default router;
