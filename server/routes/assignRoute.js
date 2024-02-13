import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { assignTask } from '../controllers/assignController.js';

const router = express.Router();

router.post('/assigntask', checkAuth, assignTask)

export default router;
