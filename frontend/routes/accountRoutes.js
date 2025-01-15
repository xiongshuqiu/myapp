const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController.js');
const { authorizeRole} = require('../../middleware/authMiddleware');

// 查找所有用户信息
router.get('/',accountController.getUsers);

// 新增用户
router.get('/create', accountController.renderCreateUserForm); // 跳转到新增用户界面
router.post('/create', accountController.createUser);

// 更新用户信息
router.get('/:_id', accountController.getUserById); // 查找特定用户信息并跳转到更新页面
router.get('/update/:_id', accountController.renderUpdateUserPage); // 渲染更新用户页面
router.post('/update/:_id', accountController.updateUser); // 提交更新的用户信息

// 删除用户信息
router.post('/delete/:_id', userController.deleteUser);

module.exports = router;




     