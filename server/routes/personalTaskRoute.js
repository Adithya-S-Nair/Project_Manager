import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { createPersonalTask, getPersonalTasks, updatePersonalTask, deletePersonalTask, getProjectPriorityBasedPersonalTask, getPriorityPersonalTaskCount, getPendingPriorityBasedPersonalTaskCount, getTotalPendingPersonalTaskCount, getPersonalTask, getPersonalTaskIdAndName, getPersonalTaskNameById } from '../controllers/personalTaskController.js';

const router = express.Router();

// Define personal task routes
router.post('/createpersonaltask', checkAuth, createPersonalTask);
router.get('/getpersonaltasks/:projectId', checkAuth, getPersonalTasks);
router.get('/getpersonaltask/:personalTaskId', checkAuth, getPersonalTask);
router.get('/getpersonaltaskidandname', checkAuth, getPersonalTaskIdAndName);
router.post('/getpersonaltasknamebyid', checkAuth, getPersonalTaskNameById);
router.patch('/updatepersonaltask/:personalTaskId', checkAuth, updatePersonalTask);
router.delete('/deletepersonaltask/:personalTaskIds', checkAuth, deletePersonalTask);
router.get('/getprojectprioritybasedpersonaltask/:projectId/:priority', checkAuth, getProjectPriorityBasedPersonalTask);
router.get('/getprioritypersonaltaskcount/:projectId', checkAuth, getPriorityPersonalTaskCount);
router.get('/getpendingprioritybasedpersonaltaskcount/:projectId', checkAuth, getPendingPriorityBasedPersonalTaskCount);
router.get('/gettotalpendingpersonaltaskcount/:projectId', checkAuth, getTotalPendingPersonalTaskCount);

export default router;