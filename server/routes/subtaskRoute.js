import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { createNewSubtask, getSubtasksByProjectId, updateSubtask, deleteSubtask } from '../controllers/subtaskController.js';

const router = express.Router();

// Define auth routes
router.post('/createnewsubtask', checkAuth, createNewSubtask)
router.get('/getprojectsubtask/:projectId', checkAuth, getSubtasksByProjectId)
router.patch('/updatesubtask/:subtaskId', checkAuth, updateSubtask)
router.delete('/deletesubtask/:subtaskId', checkAuth, deleteSubtask)

export default router;