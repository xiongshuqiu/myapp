const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 转发登录请求
router.post('/login', authController.login);

module.exports = router;



