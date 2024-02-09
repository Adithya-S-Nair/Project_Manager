import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { assignTask } from '../controllers/assignController.js';

const router = express.Router();

router.get('/assigntask', checkAuth, assignTask)

export default router;
