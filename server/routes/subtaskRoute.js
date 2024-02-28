import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import {
    createNewSubtask,
    getSubtasksByProjectId,
    updateSubtask,
    deleteSubtask,
    getPendingSubtaskCount,
    getSubtaskNameById,
    getSubtaskById,
    updateSubtaskById,
    deleteMultipleSubtask,
    getProjectSubtasks,
    getProjectSubtaskByProjectId,
    getProjectPriorityBasedSubtask
} from '../controllers/subtaskController.js';

const router = express.Router();

// Define subtask routes
router.post('/createnewsubtask', checkAuth, createNewSubtask)
router.get('/getprojectsubtask/:projectId', checkAuth, getSubtasksByProjectId)
// router.patch('/updatesubtask/:subtaskId', checkAuth, updateSubtask)
router.delete('/deletesubtask/:subtaskId', checkAuth, deleteSubtask)
router.get('/getpendingsubtaskcount/:projectId', checkAuth, getPendingSubtaskCount)
router.post('/getsubtasknamebyid', checkAuth, getSubtaskNameById)
router.get('/getsubtask/:subtaskId', checkAuth, getSubtaskById)
router.patch('/updatesubtaskbyid/:subtaskId', checkAuth, updateSubtaskById)
router.delete('/deletemultiplesubtask/:subtaskIds', checkAuth, deleteMultipleSubtask)
router.get('/getprojectsubtasks/:projectId', checkAuth, getProjectSubtasks)
router.get('/getprojectsubtaskbyprojectid/:projectId', checkAuth, getProjectSubtaskByProjectId)
router.get('/getprojectprioritybasedsubtask/:projectId/:priority', checkAuth, getProjectPriorityBasedSubtask)


export default router;