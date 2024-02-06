import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { getAllProjects, getProjectById, createProject, getProjectCompletionStatus, getRadarChartData } from '../Controllers/projectController.js';

const router = express.Router();

router.get('/getallprojects', checkAuth, getAllProjects);
router.get('/getproject/:projectId', checkAuth, getProjectById);
router.post('/createproject', checkAuth, createProject);
router.get('/getprojectcompletionstatus/:projectId', checkAuth, getProjectCompletionStatus);
router.get('/getradarchartdata/:projectId', checkAuth, getRadarChartData);

export default router;


