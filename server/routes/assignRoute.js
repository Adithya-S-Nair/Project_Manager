import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { assignTask,assignSubtask,assignProject } from '../controllers/assignController.js';

const router = express.Router();

router.post('/assigntask', checkAuth, assignTask)
router.post('/assignsubtask', checkAuth, assignSubtask)
router.post('/assignproject', checkAuth, assignProject)

export default router;
