const express = require('express');
const router = express.Router();
const authController = require('../controllers/frontend/AuthController');
router.get('/checkToken', authController.checkToken);
router.post('/login', authController.loginAttempt);
module.exports = router