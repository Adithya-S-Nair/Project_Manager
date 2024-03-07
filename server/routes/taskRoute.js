import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { createNewTask, getTasksByProjectId, updateTask, deleteTask, getPriorityTaskCount,getTaskIdAndName,getTaskNameById,getTask,deleteMultipleTask,getProjectTasks,getProjectPriorityBasedTask,getProjectTaskById, getPendingTaskCount,getTotalPendingTaskCount, getUserTasksById, getUserProjectPriorityBasedTask, getUserPriorityTaskCount, getUserPendingTaskCount, getUserTotalPendingTaskCount, getUserProjectTasks } from '../controllers/taskController.js';

const router = express.Router();

// Define task routes
router.post('/createnewtask', checkAuth, createNewTask)
router.get('/getprojecttask/:projectId', checkAuth, getTasksByProjectId)
router.get('/getprojecttasks/:projectId', checkAuth, getProjectTasks)
router.patch('/updatetask/:taskId', checkAuth, updateTask)
// router.patch('/updatetaskinline/:taskId', checkAuth, updateTask)
router.delete('/deletetask/:taskId', checkAuth, deleteTask)
router.get('/getprioritytaskcount/:projectId', checkAuth, getPriorityTaskCount)
router.get('/getpendingtaskcount/:projectId', checkAuth, getPendingTaskCount)
router.get('/gettotalpendingtaskcount/:projectId', checkAuth, getTotalPendingTaskCount)
// router.get('/gettotaltaskcount/:projectId', checkAuth, getTotalTaskCount)
router.get('/gettaskidandname', checkAuth, getTaskIdAndName)
router.post('/gettasknamebyid', checkAuth, getTaskNameById)
router.get('/gettask/:taskId', checkAuth, getTask)
router.delete('/deletemultipletask/:taskIds', checkAuth, deleteMultipleTask)
router.get('/getprojectprioritybasedtask/:projectId/:priority', checkAuth, getProjectPriorityBasedTask)
router.get('/getprojecttaskbyid/:projectId', checkAuth, getProjectTaskById)
router.get('/getusertasks/:projectId/:userId', checkAuth, getUserTasksById)
router.get('/getuserprojectprioritybasedtask/:projectId/:priority/:userId', checkAuth, getUserProjectPriorityBasedTask)
router.get('/getuserprioritytaskcount/:projectId/:userId', checkAuth, getUserPriorityTaskCount)
router.get('/getuserpendingtaskcount/:projectId/:userId', checkAuth, getUserPendingTaskCount)
router.get('/getusertotalpendingtaskcount/:projectId/:userId', checkAuth, getUserTotalPendingTaskCount)
router.get('/getuserprojecttasks/:projectId/:userId', checkAuth, getUserProjectTasks)


export default router;