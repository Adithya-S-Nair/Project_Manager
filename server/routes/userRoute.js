import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { getAllUsers, updateUser } from '../controllers/userController.js';

const router = express.Router();

// Define user routes
router.get('/getallusers', checkAuth, getAllUsers)
router.patch('/updateuser/:userId', checkAuth, updateUser)

export default router;