const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares');
const ReportController = require('../controllers/report.controller');

router.get('/', authMiddleware, ReportController.getReports);

module.exports = router;
