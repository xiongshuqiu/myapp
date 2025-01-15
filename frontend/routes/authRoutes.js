const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
// 转发进入登录页面的请求
router.get('/login', (req, res) => {
  res.render('auth/login'); // 渲染登录页面  
});

// 处理登录请求
router.post('/login', authController.postLogin)
  

module.exports = router; // 导出路由对象，供其他模块使用
