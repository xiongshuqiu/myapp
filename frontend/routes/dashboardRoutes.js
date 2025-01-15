const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController.js');
// 转发进入登录页面的请求
router.get('/dashboard', dashboardController.getDashboard);
module.exports = router; // 导出路由对象，供其他模块使用
