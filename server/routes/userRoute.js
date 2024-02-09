import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Define user routes
router.get('/getallusers', checkAuth, getAllUsers)

export default router;