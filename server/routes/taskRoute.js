import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { createNewTask, getTasksByProjectId, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

// Define auth routes
router.post('/createnewtask', checkAuth, createNewTask)
router.get('/getprojecttask/:projectId', checkAuth, getTasksByProjectId)
router.patch('/updatetask/:taskId', checkAuth, updateTask)
router.delete('/deletetask/:taskId', checkAuth, deleteTask)

export default router;