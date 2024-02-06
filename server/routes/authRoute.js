import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { login, logout, register, verify } from '../controllers/authController.js';

const router = express.Router();

// Define auth routes
router.post('/login', login);
router.post('/register', register);
router.get('/logout', checkAuth, logout);
router.get('/verify', checkAuth, verify);

export default router;