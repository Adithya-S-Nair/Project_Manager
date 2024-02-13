import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { getAllProjects, getProjectById, createProject, getProjectCompletionStatus,getProjectIdAndName, getRadarChartData, getGaugeProjectCompletionStatus,updateProjectDetail,getProjectName } from '../Controllers/projectsController.js';

const router = express.Router();

router.get('/getallprojects', checkAuth, getAllProjects);
router.get('/getproject/:projectId', checkAuth, getProjectById);
router.post('/createproject', checkAuth, createProject);
router.get('/getprojectcompletionstatus/:projectId', checkAuth, getProjectCompletionStatus);
router.get('/getradarchartdata/:projectId', checkAuth, getRadarChartData);
router.get('/getprojectidandname', checkAuth, getProjectIdAndName);
router.get('/getgaugeprojectcompletionstatus', checkAuth, getGaugeProjectCompletionStatus);
router.patch('/updateprojectdetail/:projectId', checkAuth, updateProjectDetail);
router.get('/getprojectname/:taskId', checkAuth, getProjectName);

export default router;


