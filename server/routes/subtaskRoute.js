import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import {
    createNewSubtask,
    getSubtasksByProjectId,
    updateSubtask,
    deleteSubtask,
    getPrioritySubtaskCount,
    getPendingSubtaskCount,
    getSubtaskNameById,
    getSubtaskById, 
    updateSubtaskById,
    deleteMultipleSubtask,
    getProjectSubtasks,
    getProjectSubtaskByProjectId,
    getProjectPriorityBasedSubtask,
    getTotalPendingSubtaskCount,
    getUserProjectSubtasks,
    getUserProjectPriorityBasedSubtask,
    getUserPrioritySubtaskCount,
    getUserPendingSubtaskCount,
    getUserTotalPendingSubtaskCount
} from '../controllers/subtaskController.js';

const router = express.Router();

// Define subtask routes
router.post('/createnewsubtask', checkAuth, createNewSubtask)
router.get('/getprojectsubtask/:projectId', checkAuth, getSubtasksByProjectId)
// router.patch('/updatesubtask/:subtaskId', checkAuth, updateSubtask)
router.delete('/deletesubtask/:subtaskId', checkAuth, deleteSubtask)
router.get('/getprioritysubtaskcount/:projectId', checkAuth, getPrioritySubtaskCount) 
router.get('/getpendingsubtaskcount/:projectId', checkAuth, getPendingSubtaskCount)
router.get('/gettotalpendingsubtaskcount/:projectId', checkAuth, getTotalPendingSubtaskCount)
router.post('/getsubtasknamebyid', checkAuth, getSubtaskNameById)
router.get('/getsubtask/:subtaskId', checkAuth, getSubtaskById)
router.patch('/updatesubtaskbyid/:subtaskId', checkAuth, updateSubtaskById)
router.delete('/deletemultiplesubtask/:subtaskIds', checkAuth, deleteMultipleSubtask)
router.get('/getprojectsubtasks/:projectId', checkAuth, getProjectSubtasks)
router.get('/getprojectsubtaskbyprojectid/:projectId', checkAuth, getProjectSubtaskByProjectId)
router.get('/getprojectprioritybasedsubtask/:projectId/:priority', checkAuth, getProjectPriorityBasedSubtask)
router.get('/getuserprojectsubtasks/:projectId/:userId', checkAuth, getUserProjectSubtasks)
router.get('/getuserprojectprioritybasedsubtask/:projectId/:priority/:userId', checkAuth, getUserProjectPriorityBasedSubtask)
router.get('/getuserprioritysubtaskcount/:projectId/:userId', checkAuth, getUserPrioritySubtaskCount) 
router.get('/getuserpendingsubtaskcount/:projectId/:userId', checkAuth, getUserPendingSubtaskCount)
router.get('/getusertotalpendingsubtaskcount/:projectId/:userId', checkAuth, getUserTotalPendingSubtaskCount)


export default router;