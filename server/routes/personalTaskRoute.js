import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { createPersonalTask, getPersonalTasks, updatePersonalTask, deletePersonalTask } from '../controllers/personalTaskController.js';

const router = express.Router();

// Define personal task routes
router.post('/createpersonaltask', checkAuth, createPersonalTask);
router.get('/getpersonaltasks', checkAuth, getPersonalTasks);
router.patch('/updatepersonaltask/:personalTaskId', checkAuth, updatePersonalTask);
router.delete('/deletepersonaltask/:personalTaskIds', checkAuth, deletePersonalTask);

export default router;