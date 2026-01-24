const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');

// Placeholder admin routes
router.use(isAdmin);
router.get('/dashboard', (req, res) => res.json({ success: true, data: 'Admin Dashboard' }));

module.exports = router;
