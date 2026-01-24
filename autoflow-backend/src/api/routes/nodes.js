const express = require('express');
const router = express.Router();
const NodeController = require('../controllers/NodeController');
const { authenticateApiKey } = require('../middleware/auth');

router.use(authenticateApiKey);
router.get('/', NodeController.listNodes);
router.get('/:nodeId', NodeController.getNode);
router.get('/:nodeId/health', NodeController.getNodeHealth);
router.get('/:nodeId/reputation', NodeController.getNodeReputation);

module.exports = router;
