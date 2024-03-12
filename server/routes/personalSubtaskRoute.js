import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { 
    createPersonalSubtask,
    deletePersonalSubtasks,
    updatePersonalSubtaskById,
    getAllPersonalSubtask,
    getProjectPriorityBasedPersonalSubtask,
    getPriorityPersonalSubtaskCount,
    getPendingPriorityBasedPersonalSubtaskCount,
    getTotalPendingPersonalSubtaskCount,
    getPersonalSubtask,
    getPersonalSubtaskIdAndName,
    getPersonalSubtaskNameById
} 
from '../controllers/personalSubtaskController.js';

const router = express.Router();

// Define auth routes
router.post('/createpersonalsubtask', checkAuth, createPersonalSubtask);
router.delete('/deletepersonalsubtasks/:personalSubtaskIds', checkAuth, deletePersonalSubtasks);
router.patch('/updatepersonalsubtaskbyid/:personalSubtaskId', checkAuth, updatePersonalSubtaskById)
router.get('/getpersonalsubtask/:personalSubtaskId', checkAuth, getPersonalSubtask);
router.get('/getpersonalsubtaskidandname', checkAuth, getPersonalSubtaskIdAndName);
router.post('/getpersonalsubtasknamebyid', checkAuth, getPersonalSubtaskNameById);
router.get('/getallpersonalsubtask/:projectId', checkAuth, getAllPersonalSubtask);
router.get('/getprojectprioritybasedpersonalsubtask/:projectId/:priority', checkAuth, getProjectPriorityBasedPersonalSubtask)
router.get('/getprioritypersonalsubtaskcount/:projectId', checkAuth, getPriorityPersonalSubtaskCount) 
router.get('/getpendingprioritybasedpersonalsubtaskcount/:projectId', checkAuth, getPendingPriorityBasedPersonalSubtaskCount)
router.get('/gettotalpendingpersonalsubtaskcount/:projectId', checkAuth, getTotalPendingPersonalSubtaskCount)

export default router;