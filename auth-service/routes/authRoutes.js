
   const express = require('express');
   const router = express.Router();
   const authController = require('../controllers/authController');
   
   // 定义登录请求处理
   router.post('/login', authController.postLogin);
   // 导出路由对象
   module.exports = router;
   