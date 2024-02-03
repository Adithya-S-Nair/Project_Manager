import express from 'express';
import checkAuth from '../middlewares/checkAuth.js';
import { getAllProjects,createProject } from '../Controllers/projectController.js';

const router = express.Router();

router.get('/getallprojects', checkAuth, getAllProjects);
router.post('/createproject', checkAuth, createProject);

export default router;


