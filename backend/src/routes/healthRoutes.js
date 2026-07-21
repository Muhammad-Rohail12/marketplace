const express = require('express');
const { getHealth, getTest } = require('../controllers/healthController');

const router = express.Router();

router.get('/health', getHealth);
router.get('/test', getTest);

module.exports = router;