const express = require('express');
const router = express.Router();
const {registerController, loginController, tokenController} = require('../controller/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');


router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', verifyToken, tokenController)

module.exports = router;