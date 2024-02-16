import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { createNewTask, getTasksByProjectId, updateTask, deleteTask, getPendingTaskCount,getTaskIdAndName,getTaskNameById,getTask,deleteMultipleTask } from '../controllers/taskController.js';

const router = express.Router();

// Define task routes
router.post('/createnewtask', checkAuth, createNewTask)
router.get('/getprojecttask/:projectId', checkAuth, getTasksByProjectId)
router.patch('/updatetask/:taskId', checkAuth, updateTask)
// router.patch('/updatetaskinline/:taskId', checkAuth, updateTask)
router.delete('/deletetask/:taskId', checkAuth, deleteTask)
router.get('/getpendingtaskcount/:projectId', checkAuth, getPendingTaskCount)
router.get('/gettaskidandname', checkAuth, getTaskIdAndName)
router.post('/gettasknamebyid', checkAuth, getTaskNameById)
router.get('/gettask/:taskId', checkAuth, getTask)
router.delete('/deletemultipletask/:taskIds', checkAuth, deleteMultipleTask)

export default router;