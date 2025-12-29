import express from 'express';
import githubController from '../controller/github/github.controller.js';
import analyzeController from '../controller/analyze/analyze.controller.js';


const router = express.Router();


router.post('/scan',githubController.getRepoIssues);
router.post('/analyze', analyzeController.analyzeIssues);
router.post('/analyzeById/:issueId', analyzeController.analyzeIssuesById);

export default router;