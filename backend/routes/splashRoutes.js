const express = require('express');
const { getSplashConfig } = require('../controllers/splashController');
const router = express.Router();

router.get('/splash-config', getSplashConfig);
module.exports = router;// JavaScript Document