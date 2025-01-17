// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

//1.User Profile
// (1)查找账户信息,跳转到账户信息查看页面
router.get('/:_id/view', accountController.getAccount);

// (2)修改密码提交
router.post('/:_id/password', accountController.updatePassword);

module.exports = router;
