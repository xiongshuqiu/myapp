const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');
const { authorizeRole} = require('../middleware/authMiddleware');

//1.User Profile
// (1)查找账户信息,跳转到账户信息查看页面
router.get('/:_id/view', accountController.getAccount);
// (2)修改密码提交
router.post('/:_id/password', accountController.updatePassword);
//2.Login Out
// 退出账户并跳转到登录页面
router.get('/logOut', accountController.logOut);

module.exports = router;




     