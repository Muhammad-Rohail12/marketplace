const express = require('express');
const { getTest } = require('../controllers/test.controller');

const router = express.Router();

router.get('/', getTest);

module.exports = router;