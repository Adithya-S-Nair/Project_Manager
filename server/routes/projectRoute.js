import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { getAllProjects, getProjectById, createProject } from '../Controllers/projectController.js';

const router = express.Router();

router.get('/getallprojects', checkAuth, getAllProjects);
router.get('/getproject/:projectId', checkAuth, getProjectById);
router.post('/createproject', checkAuth, createProject);

export default router;


