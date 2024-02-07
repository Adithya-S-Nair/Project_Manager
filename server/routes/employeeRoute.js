import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { appointEmployee } from '../controllers/employeeController.js';

const router = express.Router();

// Define auth routes
router.get('/appointemployee/:userId', checkAuth, appointEmployee);

export default router;