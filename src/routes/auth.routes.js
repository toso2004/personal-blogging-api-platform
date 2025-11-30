const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const verifyUser = require('../middleware/auth.middleware');

router.post('/register', authController.registerController);
router.post('/login',verifyUser, authController.loginController);

module.exports = router;