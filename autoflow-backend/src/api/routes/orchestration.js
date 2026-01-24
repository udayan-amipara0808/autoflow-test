const express = require('express');
const router = express.Router();
const OrchestratorController = require('../controllers/OrchestratorController');
const { authenticateApiKey, isAdmin } = require('../middleware/auth');

router.get('/weights', OrchestratorController.getWeights);
router.post('/simulate', authenticateApiKey, OrchestratorController.simulateSelection);
router.put('/weights', isAdmin, OrchestratorController.updateWeights);
router.get('/stats', isAdmin, OrchestratorController.getStats);

module.exports = router;
