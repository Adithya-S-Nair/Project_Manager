import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { appointEmployee,getAllEmployees } from '../controllers/employeeController.js';

const router = express.Router();

// Define auth routes
router.get('/appointemployee/:userId', checkAuth, appointEmployee);
router.get('/getallemployees', checkAuth, getAllEmployees);

export default router;