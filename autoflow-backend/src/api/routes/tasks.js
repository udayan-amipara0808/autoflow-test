const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { authenticateApiKey } = require('../middleware/auth');
const { validateTaskSubmission } = require('../middleware/validation');

router.use(authenticateApiKey);
router.post('/submit', validateTaskSubmission, TaskController.submitTask);
router.get('/', TaskController.listTasks);

module.exports = router;
