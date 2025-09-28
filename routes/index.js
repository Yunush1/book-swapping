const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const exchangeRoutes = require('./exchangeRoutes');
const fileRoutes = require('./fileRoutes');
const categoryRoutes = require('./categoryRoutes');
const requestRoutes = require('./requestRoutes');
const authMiddleware = require('../middleware/authMiddleware')

router.use('/auth', authRoutes);
router.use('/exchanges', exchangeRoutes);
router.use('/categories', authMiddleware, categoryRoutes);
router.use('/requests', authMiddleware, requestRoutes);
router.use('/files', fileRoutes);

module.exports = router;