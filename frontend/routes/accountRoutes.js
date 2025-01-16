const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');
const { authorizeRole} = require('../../middleware/authMiddleware');

//1.User Profile
// (1)查找账户信息
router.get('/:id', accountController.getAccount);
// (2)跳转到账户信息查看页面
router.get('/:id/view', accountController.accountView);
// (3)修改密码提交
router.post('/:id/password', accountController.updatePassword);
//2.Login Out
// 退出账户并跳转到登录页面
router.get('/:id/delete', accountController.deleteAccout);

module.exports = router;




     