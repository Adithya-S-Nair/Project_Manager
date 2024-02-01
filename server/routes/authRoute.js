import express from 'express';
// import checkAuth from '../middlewares/checkAuth.js';
import { login, register } from '../controllers/authControllers.js';

const router = express.Router();

// Define auth routes
router.post('/login', login);
router.post('/register', register);  
// router.get('/logout',checkAuth, logout);
   
export default router;