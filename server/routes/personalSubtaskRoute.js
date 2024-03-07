import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { createPersonalSubtask,
    deletePersonalSubtasks,
    updatePersonalSubtaskById,
    getAllPersonalSubtask,
    getProjectPriorityBasedPersonalSubtask,
    getPriorityPersonalSubtaskCount 
} 
from '../controllers/personalSubtaskController.js';

const router = express.Router();

// Define auth routes
router.post('/createpersonalsubtask', checkAuth, createPersonalSubtask);
router.delete('/deletepersonalsubtasks/:personalSubtaskIds', checkAuth, deletePersonalSubtasks);
router.patch('/updatepersonalsubtaskbyid/:personalSubtaskId', checkAuth, updatePersonalSubtaskById)
router.get('/getallpersonalsubtask', checkAuth, getAllPersonalSubtask);
router.get('/getprojectprioritybasedpersonalsubtask/:projectId/:priority', checkAuth, getProjectPriorityBasedPersonalSubtask)
router.get('/getprioritypersonalsubtaskcount/:projectId', checkAuth, getPriorityPersonalSubtaskCount) 


export default router;