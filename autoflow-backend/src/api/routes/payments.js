const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { authenticateApiKey } = require('../middleware/auth');

router.use(authenticateApiKey);
router.get('/', PaymentController.listPayments);
router.get('/:txHash', PaymentController.getPayment);
router.get('/escrows/active', PaymentController.getActiveEscrows);
router.get('/escrows/:escrowId', PaymentController.getEscrow);

module.exports = router;
