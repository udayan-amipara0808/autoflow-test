const express = require('express');
const router = express.Router();
const AgentController = require('../controllers/AgentController');
const { authenticateApiKey } = require('../middleware/auth');

router.post('/create', AgentController.createAgent);
router.use(authenticateApiKey);
router.get('/me', AgentController.getCurrentAgent);
router.get('/balance', AgentController.getBalance);
router.get('/tasks', AgentController.getTaskHistory);
router.get('/analytics', AgentController.getAnalytics);
router.post('/regenerate-api-key', AgentController.regenerateApiKey);
router.put('/settings', AgentController.updateSettings);

module.exports = router;
